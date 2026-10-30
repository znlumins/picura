import { describe, it, expect, beforeAll } from "vitest";
import prisma from "../src/lib/prisma";
import { ensureSeedData } from "../src/lib/seed";
import { POST as createUpgradeOrder } from "../src/app/api/v1/payments/upgrade/route";
import { POST as handlePaymentWebhook } from "../src/app/api/v1/payments/webhook/route";
import crypto from "crypto";

describe("Payment Gateway & Subscription Upgrade (TRD 2.4 & AFD Flow 5)", () => {
  let demoUser: any;

  beforeAll(async () => {
    demoUser = await ensureSeedData();
  });

  it("creates upgrade order and upgrades user tier on auto_settle", async () => {
    const req = new Request("http://localhost:3000/api/v1/payments/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tier: "PRO_FREELANCE",
        auto_settle: true,
      }),
    });

    const res = await createUpgradeOrder(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("success");
    expect(body.data.tier).toBe("PRO_FREELANCE");
    expect(body.data.amount).toBe(99000);
    expect(body.data.payment_status).toBe("SETTLED");

    // Check user updated in database
    const updatedUser = await prisma.user.findUnique({
      where: { id: demoUser.id },
    });
    expect(updatedUser?.subscriptionTier).toBe("PRO_FREELANCE");
  });

  it("handles Midtrans webhook with valid signature and ensures idempotency", async () => {
    // 1. Create a pending subscription order
    const pendingReq = new Request("http://localhost:3000/api/v1/payments/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tier: "STUDIO",
        auto_settle: false,
      }),
    });
    const pendingRes = await createUpgradeOrder(pendingReq);
    const pendingBody = await pendingRes.json();
    const orderId = pendingBody.data.order_id;
    const grossAmount = "249000.00";
    const statusCode = "200";
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-PicuraDevKey-12345";

    const signatureKey = crypto
      .createHash("sha512")
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest("hex");

    // 2. Dispatch webhook
    const webhookReq = new Request("http://localhost:3000/api/v1/payments/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId,
        status_code: statusCode,
        gross_amount: grossAmount,
        signature_key: signatureKey,
        transaction_status: "settlement",
      }),
    });

    const webhookRes = await handlePaymentWebhook(webhookReq);
    const webhookBody = await webhookRes.json();

    expect(webhookRes.status).toBe(200);
    expect(webhookBody.status).toBe("success");

    // Check user upgraded to STUDIO
    const userAfterWebhook = await prisma.user.findUnique({
      where: { id: demoUser.id },
    });
    expect(userAfterWebhook?.subscriptionTier).toBe("STUDIO");

    // 3. Test idempotency (replaying the same webhook notification)
    const replayReq = new Request("http://localhost:3000/api/v1/payments/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId,
        status_code: statusCode,
        gross_amount: grossAmount,
        signature_key: signatureKey,
        transaction_status: "settlement",
      }),
    });

    const replayRes = await handlePaymentWebhook(replayReq);
    const replayBody = await replayRes.json();

    expect(replayRes.status).toBe(200);
    expect(replayBody.message).toContain("already processed and settled");
  });
});
