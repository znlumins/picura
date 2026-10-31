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

export interface UserTierRecord {
  tier: string;
  expiresAt: Date;
}

const globalForSub = globalThis as unknown as {
  mockSubscriptions?: Map<string, SubscriptionRecord>;
  mockUserTiers?: Map<string, UserTierRecord>;
};

export const memorySubscriptions =
  globalForSub.mockSubscriptions || new Map<string, SubscriptionRecord>();

export const memoryUserTiers =
  globalForSub.mockUserTiers || new Map<string, UserTierRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForSub.mockSubscriptions = memorySubscriptions;
  globalForSub.mockUserTiers = memoryUserTiers;
}
