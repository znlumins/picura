export interface SubscriptionRecord {
  id: string;
  userId: string;
  orderId: string;
  tierPlan: string;
  amount: number;
  paymentStatus: "PENDING" | "SETTLED" | "FAILED" | "EXPIRED";
  paymentGateway: string;
  rawPayload?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const globalForSub = globalThis as unknown as {
  mockSubscriptions?: Map<string, SubscriptionRecord>;
};

export const memorySubscriptions =
  globalForSub.mockSubscriptions || new Map<string, SubscriptionRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForSub.mockSubscriptions = memorySubscriptions;
}
