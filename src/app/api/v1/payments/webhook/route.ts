import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-PicuraDevKey-12345";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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

    const subscription = await prisma.subscription.findUnique({
      where: { orderId: order_id },
      include: { user: true },
    });

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
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          paymentStatus: transaction_status === "expire" ? "EXPIRED" : "FAILED",
          rawPayload: JSON.stringify(body),
        },
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Webhook processed successfully",
    });
  } catch (error: any) {
    console.error("Payment webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing error", details: error.message },
      { status: 500 }
    );
  }
}
