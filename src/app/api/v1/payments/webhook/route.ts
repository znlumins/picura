import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { memorySubscriptions, SubscriptionRecord } from "@/lib/subscription-store";

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

    // Verify SHA512 signature key if provided
    if (signature_key && gross_amount && status_code) {
      const payloadString = `${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`;
      const calculatedSignature = crypto
        .createHash("sha512")
        .update(payloadString)
        .digest("hex");

      if (signature_key !== calculatedSignature) {
        console.warn("Invalid Midtrans signature key rejected");
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
      }
    }

    // Look up subscription in DB, fallback to memory store
    let subscription: SubscriptionRecord | null = null;
    let foundInDb = false;

    try {
      const dbSub = await prisma.subscription.findUnique({
        where: { orderId: order_id },
        include: { user: true },
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
      // DB offline, fall through to memory store
    }

    if (!subscription) {
      subscription = memorySubscriptions.get(order_id) || null;
    }

    if (!subscription) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Idempotency check: if already settled, return 200 OK immediately
    if (subscription.paymentStatus === "SETTLED") {
      return NextResponse.json({
        status: "ok",
        message: "Order already processed and settled",
      });
    }

    let isSuccess = false;
    if (transaction_status === "capture") {
      isSuccess = fraud_status === "accept";
    } else if (transaction_status === "settlement") {
      isSuccess = true;
    }

    if (isSuccess) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days extension

      subscription.paymentStatus = "SETTLED";
      subscription.rawPayload = JSON.stringify(body);
      subscription.updatedAt = new Date();
      memorySubscriptions.set(order_id, subscription);

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
          // Handled gracefully
        }
      }
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      subscription.paymentStatus = transaction_status === "expire" ? "EXPIRED" : "FAILED";
      subscription.rawPayload = JSON.stringify(body);
      subscription.updatedAt = new Date();
      memorySubscriptions.set(order_id, subscription);

      if (foundInDb) {
        try {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              paymentStatus: subscription.paymentStatus,
              rawPayload: JSON.stringify(body),
            },
          });
        } catch {
          // Handled gracefully
        }
      }
    }

    return NextResponse.json({
      status: "success",
      message: "Webhook processed successfully",
      data: {
        order_id: order_id,
        payment_status: subscription.paymentStatus,
      },
    });
  } catch (error: any) {
    console.error("Payment webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing error", details: error.message },
      { status: 500 }
    );
  }
}
