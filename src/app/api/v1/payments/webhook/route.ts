import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { memorySubscriptions, memoryUserTiers, SubscriptionRecord } from "@/lib/subscription-store";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-PicuraDevKey-12345";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    // Verify SHA512 signature if signature_key is supplied
    if (signature_key) {
      const payloadString = `${order_id}${status_code || ""}${gross_amount || ""}${MIDTRANS_SERVER_KEY}`;
      const expectedSignature = crypto
        .createHash("sha512")
        .update(payloadString)
        .digest("hex");

      if (signature_key !== expectedSignature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
      }
    }

    // Lookup order in Prisma or Memory store
    let subscription: SubscriptionRecord | null = null;
    let foundInDb = false;

    try {
      const dbSub = await prisma.subscription.findUnique({
        where: { orderId: order_id },
      });
      if (dbSub) {
        subscription = {
          id: dbSub.id,
          userId: dbSub.userId,
          orderId: dbSub.orderId,
          tierPlan: dbSub.tierPlan,
          amount: dbSub.amount,
          paymentStatus: dbSub.paymentStatus as any,
          paymentGateway: dbSub.paymentGateway,
          rawPayload: dbSub.rawPayload,
          createdAt: dbSub.createdAt,
          updatedAt: dbSub.updatedAt,
        };
        foundInDb = true;
      }
    } catch {
      // Database unavailable, check memory store
    }

    if (!subscription) {
      subscription = memorySubscriptions.get(order_id) || null;
    }

    if (!subscription) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Idempotency check: If already settled, do not process again
    if (subscription.paymentStatus === "SETTLED") {
      return NextResponse.json({
        status: "success",
        message: "Order already processed and settled",
        data: { order_id, payment_status: "SETTLED" },
      });
    }

    let isSuccess = false;
    let isFailed = false;

    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        subscription.paymentStatus = "PENDING";
      } else if (fraud_status === "accept" || !fraud_status) {
        isSuccess = true;
      }
    } else if (transaction_status === "settlement") {
      isSuccess = true;
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      isFailed = true;
    } else if (transaction_status === "pending") {
      subscription.paymentStatus = "PENDING";
    }

    if (isSuccess) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days extension

      subscription.paymentStatus = "SETTLED";
      subscription.rawPayload = JSON.stringify(body);
      subscription.updatedAt = new Date();
      memorySubscriptions.set(order_id, subscription);
      memoryUserTiers.set(subscription.userId, { tier: subscription.tierPlan, expiresAt });
      memoryUserTiers.set("demo-user-1", { tier: subscription.tierPlan, expiresAt });

      if (foundInDb) {
        try {
          await prisma.$transaction([
            prisma.subscription.update({
              where: { id: subscription.id },
              data: {
                paymentStatus: "SETTLED",
                rawPayload: JSON.stringify(body),
              },
            }),
            prisma.user.update({
              where: { id: subscription.userId },
              data: {
                subscriptionTier: subscription.tierPlan,
                subscriptionExpiresAt: expiresAt,
              },
            }),
          ]);
        } catch {
          // Handled in memoryUserTiers
        }
      }
    } else if (isFailed) {
      subscription.paymentStatus = "FAILED";
      subscription.rawPayload = JSON.stringify(body);
      subscription.updatedAt = new Date();
      memorySubscriptions.set(order_id, subscription);

      if (foundInDb) {
        try {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              paymentStatus: "FAILED",
              rawPayload: JSON.stringify(body),
            },
          });
        } catch {
          // Ignore
        }
      }
    }

    return NextResponse.json({
      status: "success",
      message: `Webhook processed: payment ${subscription.paymentStatus.toLowerCase()}`,
      data: {
        order_id: subscription.orderId,
        payment_status: subscription.paymentStatus,
        tier: subscription.tierPlan,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Webhook internal failure", details: error.message },
      { status: 500 }
    );
  }
}
