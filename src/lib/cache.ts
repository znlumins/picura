// In-memory cache manager with TTL support, designed to match Redis operations
// specified in BSD.md section 3.

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null; // null means no expiration
}

class CacheManager {
  private store: Map<string, CacheEntry<any>> = new Map();

  constructor() {
    // Periodically prune expired entries every 5 minutes
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.pruneExpired(), 5 * 60 * 1000).unref?.();
    }
  }

  set<T>(key: string, value: T, ttlSeconds?: number): void {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  del(key: string): boolean {
    return this.store.delete(key);
  }

  // Atomic increment for rate limiting
  increment(key: string, ttlSeconds: number = 60): number {
    const entry = this.store.get(key);
    const now = Date.now();

    if (!entry || (entry.expiresAt !== null && now > entry.expiresAt)) {
      this.store.set(key, {
        value: 1,
        expiresAt: now + ttlSeconds * 1000,
      });
      return 1;
    }

    const nextVal = (typeof entry.value === "number" ? entry.value : 0) + 1;
    entry.value = nextVal;
    return nextVal;
  }

  private pruneExpired(): void {
    const now = Date.now();
    this.store.forEach((entry, key) => {
      if (entry.expiresAt !== null && now > entry.expiresAt) {
        this.store.delete(key);
      }
    });
  }

  clear(): void {
    this.store.clear();
  }
}

export const cache = new CacheManager();
export default cache;
