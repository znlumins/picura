import { describe, it, expect, beforeEach } from "vitest";
import {
  normalizePhoneNumber,
  formatWhatsAppMessage,
  generateWhatsAppLink,
} from "../src/lib/whatsapp";
import {
  extractFolderId,
  transformThumbnailUrl,
  fetchDrivePhotos,
} from "../src/lib/google-drive";
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  verifyToken,
  encryptToken,
  decryptToken,
} from "../src/lib/auth";
import cache from "../src/lib/cache";
import { checkRateLimit } from "../src/lib/rate-limiter";

describe("WhatsApp Deep Link Engine (TRD 2.3 & AFD Flow 4)", () => {
  it("normalizes Indonesian phone numbers correctly", () => {
    expect(normalizePhoneNumber("081234567890")).toBe("6281234567890");
    expect(normalizePhoneNumber("+62 812-3456-7890")).toBe("6281234567890");
    expect(normalizePhoneNumber("6281234567890")).toBe("6281234567890");
    expect(normalizePhoneNumber("0857-1122-3344")).toBe("6285711223344");
  });

  it("formats WhatsApp message with accurate numbering and client notes", () => {
    const files = ["IMG_0001.JPG", "IMG_0005.JPG", "IMG_0089.JPG"];
    const message = formatWhatsAppMessage(
      "Wedding Budi & Ani",
      files,
      "Budi Santoso",
      "Tolong cerahkan warna foto outdoor"
    );

    expect(message).toContain("Wedding Budi & Ani");
    expect(message).toContain("Budi Santoso");
    expect(message).toContain("1. IMG_0001.JPG");
    expect(message).toContain("2. IMG_0005.JPG");
    expect(message).toContain("3. IMG_0089.JPG");
    expect(message).toContain("Total: 3 Foto");
    expect(message).toContain("Tolong cerahkan warna foto outdoor");
  });

  it("generates wa.me deep link and web link", () => {
    const result = generateWhatsAppLink(
      "081234567890",
      "Prewedding Session",
      ["IMG_1.JPG", "IMG_2.JPG"]
    );

    expect(result.phoneNumber).toBe("6281234567890");
    expect(result.deepLink).toContain("https://wa.me/6281234567890?text=");
    expect(result.webLink).toContain("https://web.whatsapp.com/send?phone=6281234567890");
  });
});

describe("Google Drive Metadata & Sizing Engine (TRD 2.2)", () => {
  it("extracts folder ID from diverse Google Drive URL patterns", () => {
    const url1 = "https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456";
    const url2 = "https://drive.google.com/drive/u/0/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456?usp=sharing";
    const url3 = "https://drive.google.com/open?id=1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456";
    const rawId = "1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456";

    expect(extractFolderId(url1)).toBe("1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456");
    expect(extractFolderId(url2)).toBe("1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456");
    expect(extractFolderId(url3)).toBe("1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456");
    expect(extractFolderId(rawId)).toBe("1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456");
  });

  it("transforms thumbnail sizes according to Grid (=s400) and Lightbox (=s1600)", () => {
    const sampleUrl = "https://lh3.googleusercontent.com/d/123456=s220";
    expect(transformThumbnailUrl(sampleUrl, 400)).toBe("https://lh3.googleusercontent.com/d/123456=s400");
    expect(transformThumbnailUrl(sampleUrl, 1600)).toBe("https://lh3.googleusercontent.com/d/123456=s1600");
  });

  it("fetches photos and caches them in memory", async () => {
    const photos = await fetchDrivePhotos("folder_test_123");
    expect(photos.length).toBeGreaterThan(0);
    expect(photos[0]).toHaveProperty("thumbnailUrl");
    expect(photos[0]).toHaveProperty("previewUrl");

    // Cache hit verification
    const cached = cache.get<any[]>("cache:drive:folder:folder_test_123");
    expect(cached).toBeDefined();
    expect(cached?.length).toBe(photos.length);
  });
});

describe("Security & Cryptography (TRD 3.1, 3.2, 3.4)", () => {
  it("hashes and verifies password using bcrypt", async () => {
    const pass = "secret123";
    const hashed = await hashPassword(pass);
    expect(hashed).not.toBe(pass);
    expect(await verifyPassword(pass, hashed)).toBe(true);
    expect(await verifyPassword("wrongPass", hashed)).toBe(false);
  });

  it("generates and verifies JWT tokens", () => {
    const payload = { userId: "user-uuid-1", email: "test@picura.id", tier: "PRO" };
    const token = generateAccessToken(payload);
    const decoded = verifyToken(token);
    expect(decoded?.userId).toBe("user-uuid-1");
    expect(decoded?.email).toBe("test@picura.id");
    expect(decoded?.tier).toBe("PRO");
  });

  it("encrypts and decrypts OAuth tokens using AES-256-GCM", () => {
    const secretRefreshToken = "ya29.a0ARrdaM-sensitive-google-refresh-token-value";
    const encrypted = encryptToken(secretRefreshToken);
    expect(encrypted).not.toBe(secretRefreshToken);
    expect(encrypted.split(":").length).toBe(3); // iv:authTag:ciphertext

    const decrypted = decryptToken(encrypted);
    expect(decrypted).toBe(secretRefreshToken);
  });
});

describe("In-Memory Cache & Rate Limiter (TRD 3.3, BSD 3)", () => {
  beforeEach(() => {
    cache.clear();
  });

  it("handles basic cache set, get, and ttl", () => {
    cache.set("test_key", { data: 123 }, 60);
    expect(cache.get("test_key")).toEqual({ data: 123 });
  });

  it("enforces rate limits accurately", () => {
    const key = "test_rate_limit_ip";
    const limit = 3;

    const r1 = checkRateLimit(key, limit, 60);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit(key, limit, 60);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit(key, limit, 60);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);

    const r4 = checkRateLimit(key, limit, 60);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
  });
});
