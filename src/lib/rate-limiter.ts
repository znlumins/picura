import cache from "./cache";

export interface RateLimitResult {
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
}

export function checkRateLimit(key: string, limit: number, windowSeconds: number = 60): RateLimitResult {
  const current = cache.increment(key, windowSeconds);
  const allowed = current <= limit;
  const remaining = Math.max(0, limit - current);

  return {
    allowed,
    current,
    limit,
    remaining,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
