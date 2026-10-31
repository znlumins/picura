import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";
import { verifyToken } from "@/lib/auth";
import { memorySubscriptions, SubscriptionRecord } from "@/lib/subscription-store";

const PRICING_PLANS: Record<string, { name: string; amount: number }> = {
  PRO_FREELANCE: { name: "Pro Freelance", amount: 49000 },
  STUDIO: { name: "Studio Agency", amount: 129000 },
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { tier = "PRO_FREELANCE", auto_settle = false } = body;

    const plan = PRICING_PLANS[tier];
    if (!plan) {
      return NextResponse.json({ error: "Paket langganan tidak valid" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    let user: { id: string; name: string; email: string } | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const decoded = verifyToken(authHeader.substring(7));
      if (decoded?.userId) {
        try {
          user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        } catch {
          // DB unreachable, use decoded
          user = { id: decoded.userId, name: "Demo Fotografer", email: "demo@picura.id" };
        }
      }
    }

    if (!user) {
      try {
        await ensureSeedData().catch(() => null);
        user = await prisma.user.findFirst({ where: { email: "demo@picura.id" } });
      } catch {
        // Fallback demo user
        user = { id: "demo-user-1", name: "Demo Fotografer", email: "demo@picura.id" };
      }
    }

    if (!user) {
      user = { id: "demo-user-1", name: "Demo Fotografer", email: "demo@picura.id" };
    }

    const orderId = `PICURA-${tier}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const paymentStatus = auto_settle ? "SETTLED" : "PENDING";

    // Attempt to persist in Prisma; fallback to memory store if DB is offline
    let subscription: SubscriptionRecord | null = null;
    try {
      const dbSub = await prisma.subscription.create({
        data: {
          userId: user.id,
          orderId,
          tierPlan: tier,
          amount: plan.amount,
          paymentStatus,
          paymentGateway: "SOCIABUZZ",
        },
      });
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
    } catch {
      // Memory store fallback
      subscription = {
        id: `sub-${Date.now()}`,
        userId: user.id,
        orderId,
        tierPlan: tier,
        amount: plan.amount,
        paymentStatus,
        paymentGateway: "SOCIABUZZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memorySubscriptions.set(orderId, subscription);
    }

    if (auto_settle) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days active

      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionTier: tier,
            subscriptionExpiresAt: expiresAt,
          },
        });
      } catch {
        // Handled in demo state
      }
    }

    return NextResponse.json({
      status: "success",
      message: auto_settle ? "Langganan berhasil diaktifkan" : "Order transaksi berhasil dibuat",
      data: {
        order_id: orderId,
        tier: tier,
        amount: plan.amount,
        payment_status: subscription.paymentStatus,
        payment_url: `https://sociabuzz.com/mindyourkills/tribe?amount=${plan.amount}&note=${orderId}`,
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
