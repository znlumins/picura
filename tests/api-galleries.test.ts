import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import prisma from "../src/lib/prisma";
import { ensureSeedData } from "../src/lib/seed";
import { GET as getMe } from "../src/app/api/v1/auth/me/route";
import { GET as getGalleries, POST as createGallery } from "../src/app/api/v1/galleries/route";
import { GET as getGalleryDetail, DELETE as deleteGallery } from "../src/app/api/v1/galleries/[slug]/route";
import { POST as verifyGalleryPassword } from "../src/app/api/v1/galleries/[slug]/verify-password/route";
import { POST as submitSelection } from "../src/app/api/v1/galleries/[slug]/submit/route";

describe("API Integration: Galleries & Client Selection Flow", () => {
  let demoUser: any;

  beforeAll(async () => {
    demoUser = await ensureSeedData();
  });

  beforeEach(async () => {
    // Reset user tier to FREEMIUM for quota enforcement tests
    await prisma.user.update({
      where: { id: demoUser.id },
      data: { subscriptionTier: "FREEMIUM" },
    });

    // Delete any test created galleries to keep test state deterministic
    await prisma.gallery.deleteMany({
      where: {
        userId: demoUser.id,
        slug: { notIn: ["wedding-radit-vanya", "graduation-sarah-ui-2026"] },
      },
    });

    // Reset status to ACTIVE for the 2 seeded galleries
    await prisma.gallery.updateMany({
      where: {
        userId: demoUser.id,
        slug: { in: ["wedding-radit-vanya", "graduation-sarah-ui-2026"] },
      },
      data: { status: "ACTIVE" },
    });
  });

  it("GET /api/v1/auth/me returns photographer profile and stats", async () => {
    const req = new Request("http://localhost:3000/api/v1/auth/me");
    const res = await getMe(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("success");
    expect(body.user.email).toBe("demo@picura.id");
    expect(body.stats).toHaveProperty("activeGalleries");
    expect(body.stats).toHaveProperty("quotaLimit");
  });

  it("GET /api/v1/galleries returns seeded galleries", async () => {
    const req = new Request("http://localhost:3000/api/v1/galleries");
    const res = await getGalleries(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("success");
    expect(body.data.length).toBeGreaterThanOrEqual(2);
  });

  it("Enforces Freemium tier limit of 2 active galleries", async () => {
    // Both seeded galleries are ACTIVE (count = 2).
    // Attempting to create a 3rd gallery on FREEMIUM tier must return 403
    const req = new Request("http://localhost:3000/api/v1/galleries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Third Gallery Should Exceed Quota",
        drive_folder_url: "https://drive.google.com/drive/folders/1testFolderExceed",
        max_selection_quota: 15,
        editor_whatsapp: "081234567890",
      }),
    });

    const res = await createGallery(req);
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.error).toBe("QUOTA_EXCEEDED");
    expect(body.requires_upgrade).toBe(true);
  });

  it("GET /api/v1/galleries/[slug] masks photos for password-protected gallery", async () => {
    const req = new Request("http://localhost:3000/api/v1/galleries/wedding-radit-vanya");
    const res = await getGalleryDetail(req, { params: { slug: "wedding-radit-vanya" } });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("locked");
    expect(body.is_password_protected).toBe(true);
    expect(body.data.photos).toBeUndefined();
  });

  it("POST /api/v1/galleries/[slug]/verify-password rejects invalid PIN and approves correct PIN", async () => {
    // Wrong password
    const wrongReq = new Request("http://localhost:3000/api/v1/galleries/wedding-radit-vanya/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrongpassword" }),
    });
    const wrongRes = await verifyGalleryPassword(wrongReq, { params: { slug: "wedding-radit-vanya" } });
    const wrongBody = await wrongRes.json();
    expect(wrongRes.status).toBe(401);
    expect(wrongBody.error).toBe("INVALID_PASSWORD");

    // Correct password ("123456")
    const correctReq = new Request("http://localhost:3000/api/v1/galleries/wedding-radit-vanya/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "123456" }),
    });
    const correctRes = await verifyGalleryPassword(correctReq, { params: { slug: "wedding-radit-vanya" } });
    const correctBody = await correctRes.json();
    expect(correctRes.status).toBe(200);
    expect(correctBody.token).toBeDefined();

    // Now access gallery with the token
    const authGalleryReq = new Request("http://localhost:3000/api/v1/galleries/wedding-radit-vanya", {
      headers: { "x-gallery-token": correctBody.token },
    });
    const authGalleryRes = await getGalleryDetail(authGalleryReq, { params: { slug: "wedding-radit-vanya" } });
    const authGalleryBody = await authGalleryRes.json();
    expect(authGalleryRes.status).toBe(200);
    expect(authGalleryBody.status).toBe("success");
    expect(authGalleryBody.data.photos.length).toBeGreaterThan(0);
  });

  it("POST /api/v1/galleries/[slug]/submit rejects when exceeding quota and accepts valid selection", async () => {
    // Gallery has quota 10 for graduation-sarah-ui-2026
    const excessFiles = Array.from({ length: 15 }, (_, i) => ({
      file_id: `f_${i}`,
      filename: `IMG_${i}.JPG`,
    }));

    const excessReq = new Request("http://localhost:3000/api/v1/galleries/graduation-sarah-ui-2026/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_name: "Sarah UI",
        selected_files: excessFiles,
      }),
    });

    const excessRes = await submitSelection(excessReq, { params: { slug: "graduation-sarah-ui-2026" } });
    const excessBody = await excessRes.json();
    expect(excessRes.status).toBe(400);
    expect(excessBody.error).toBe("QUOTA_EXCEEDED");

    // Valid selection (3 photos)
    const validFiles = [
      { file_id: "f_1", filename: "IMG_0012.JPG" },
      { file_id: "f_2", filename: "IMG_0015.JPG" },
      { file_id: "f_3", filename: "IMG_0023.JPG" },
    ];

    const validReq = new Request("http://localhost:3000/api/v1/galleries/graduation-sarah-ui-2026/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_name: "Sarah UI",
        client_notes: "Mohon diedit tone warm aesthetic ya Kak",
        selected_files: validFiles,
      }),
    });

    const validRes = await submitSelection(validReq, { params: { slug: "graduation-sarah-ui-2026" } });
    const validBody = await validRes.json();

    expect(validRes.status).toBe(200);
    expect(validBody.status).toBe("success");
    expect(validBody.data.total_selected).toBe(3);
    expect(validBody.data.whatsapp_url).toContain("https://wa.me/6289876543210?text=");
    expect(validBody.data.message_text).toContain("Sarah UI");
    expect(validBody.data.message_text).toContain("IMG_0012.JPG");
    expect(validBody.data.message_text).toContain("Mohon diedit tone warm aesthetic ya Kak");
  });
});
