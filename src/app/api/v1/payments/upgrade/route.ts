import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";
import { verifyToken } from "@/lib/auth";

const PRICING_PLANS: Record<string, { name: string; amount: number }> = {
  PRO_FREELANCE: { name: "Pro Freelance", amount: 49000 },
  STUDIO: { name: "Studio Agency", amount: 129000 },
};

export async function POST(req: Request) {
  try {
    await ensureSeedData();

    const authHeader = req.headers.get("authorization");
    let user = null;
    if (authHeader?.startsWith("Bearer ")) {
      const decoded = verifyToken(authHeader.substring(7));
      if (decoded?.userId) {
        user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      }
    }
    if (!user) {
      user = await prisma.user.findFirst({ where: { email: "demo@picura.id" } });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const { tier = "PRO_FREELANCE", auto_settle = false } = body;

    const plan = PRICING_PLANS[tier];
    if (!plan) {
      return NextResponse.json({ error: "Paket langganan tidak valid" }, { status: 400 });
    }

    const orderId = `PICURA-${tier}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Create subscription record
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        orderId,
        tierPlan: tier,
        amount: plan.amount,
        paymentStatus: auto_settle ? "SETTLED" : "PENDING",
        paymentGateway: "MIDTRANS",
      },
    });

    if (auto_settle) {
      // Instantly upgrade user in demo/dev mode
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days active

      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionTier: tier,
          subscriptionExpiresAt: expiresAt,
        },
      });
    }

    return NextResponse.json({
      status: "success",
      message: auto_settle ? "Langganan berhasil diaktifkan" : "Order transaksi berhasil dibuat",
      data: {
        order_id: orderId,
        tier: tier,
        amount: plan.amount,
        payment_status: subscription.paymentStatus,
        payment_url: `https://app.midtrans.com/snap/v2/vtweb/${orderId}`,
        auto_settled: auto_settle,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal membuat pesanan langganan", details: error.message },
      { status: 500 }
    );
  }
}
