import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";
import { verifyToken, hashPassword } from "@/lib/auth";
import { extractFolderId, fetchDrivePhotos } from "@/lib/google-drive";
import { normalizePhoneNumber } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${randomSuffix}`;
}

async function getAuthenticatedUser(req: Request) {
  await ensureSeedData();

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (decoded?.userId) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (user) return user;
    }
  }

  // Fallback to demo user
  return prisma.user.findFirst({
    where: { email: "demo@picura.id" },
  });
}

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const galleries = await prisma.gallery.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: {
            photos: true,
            selections: true,
          },
        },
        selections: {
          orderBy: { submittedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const activeCount = galleries.filter((g) => g.status === "ACTIVE").length;
    const quotaLimit = user.subscriptionTier === "FREEMIUM" ? 2 : 999;

    const formatted = galleries.map((g) => {
      const latestSelection = g.selections[0] || null;
      let latestSelectedCount = 0;
      if (latestSelection) {
        latestSelectedCount = latestSelection.totalSelected;
      }

      return {
        id: g.id,
        title: g.title,
        slug: g.slug,
        googleDriveFolderId: g.googleDriveFolderId,
        maxSelectionQuota: g.maxSelectionQuota,
        hasPassword: !!g.passwordHash,
        editorWhatsappNumber: g.editorWhatsappNumber,
        status: g.status,
        expiresAt: g.expiresAt,
        createdAt: g.createdAt,
        totalPhotos: g._count.photos,
        totalSelectionsSubmitted: g._count.selections,
        latestSelectedCount: latestSelectedCount,
        progressPercent: g.maxSelectionQuota > 0 ? Math.min(100, Math.round((latestSelectedCount / g.maxSelectionQuota) * 100)) : 0,
      };
    });

    return NextResponse.json({
      status: "success",
      meta: {
        activeCount,
        quotaLimit,
        canCreateMore: activeCount < quotaLimit,
        userTier: user.subscriptionTier,
      },
      data: formatted,
    });
  } catch (error: any) {
    console.error("Fetch galleries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch galleries", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check tier quota limit (Freemium: max 2 active galleries)
    const activeCount = await prisma.gallery.count({
      where: { userId: user.id, status: "ACTIVE" },
    });

    const quotaLimit = user.subscriptionTier === "FREEMIUM" ? 2 : 999;
    if (activeCount >= quotaLimit) {
      return NextResponse.json(
        {
          error: "QUOTA_EXCEEDED",
          message:
            "Batas paket Freemium tercapai (maksimal 2 galeri aktif). Silakan upgrade ke Pro Freelance atau Studio untuk membuat galeri tambahan.",
          current_active: activeCount,
          quota_limit: quotaLimit,
          requires_upgrade: true,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      drive_folder_url,
      max_selection_quota = 20,
      password,
      editor_whatsapp,
      expires_at,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Judul galeri wajib diisi" },
        { status: 400 }
      );
    }

    if (!drive_folder_url || !drive_folder_url.trim()) {
      return NextResponse.json(
        { error: "URL / Folder ID Google Drive wajib diisi" },
        { status: 400 }
      );
    }

    const folderId = extractFolderId(drive_folder_url);
    if (!folderId) {
      return NextResponse.json(
        { error: "URL atau ID Google Drive tidak valid" },
        { status: 400 }
      );
    }

    if (!editor_whatsapp || !editor_whatsapp.trim()) {
      return NextResponse.json(
        { error: "Nomor WhatsApp editor wajib diisi" },
        { status: 400 }
      );
    }

    const cleanPhone = normalizePhoneNumber(editor_whatsapp);
    if (!cleanPhone || cleanPhone.length < 8) {
      return NextResponse.json(
        { error: "Format nomor WhatsApp tidak valid" },
        { status: 400 }
      );
    }

    let passwordHash: string | null = null;
    if (password && password.trim()) {
      passwordHash = await hashPassword(password.trim());
    }

    const slug = generateSlug(title);

    // Create gallery record
    const gallery = await prisma.gallery.create({
      data: {
        userId: user.id,
        title: title.trim(),
        slug: slug,
        googleDriveFolderId: folderId,
        maxSelectionQuota: Number(max_selection_quota) || 20,
        passwordHash: passwordHash,
        editorWhatsappNumber: cleanPhone,
        expiresAt: expires_at ? new Date(expires_at) : null,
        status: "ACTIVE",
      },
    });

    // Ingest & cache photos from Google Drive
    const drivePhotos = await fetchDrivePhotos(folderId, user.googleAccessToken);
    if (drivePhotos && drivePhotos.length > 0) {
      const records = drivePhotos.map((p) => ({
        galleryId: gallery.id,
        driveFileId: p.id,
        fileName: p.name,
        thumbnailUrl: p.thumbnailUrl,
        webContentLink: p.previewUrl,
      }));

      for (const rec of records) {
        await prisma.photoCache.create({ data: rec });
      }
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Galeri berhasil dibuat",
        data: {
          id: gallery.id,
          title: gallery.title,
          slug: gallery.slug,
          public_url: `/g/${gallery.slug}`,
          max_selection_quota: gallery.maxSelectionQuota,
          has_password: !!gallery.passwordHash,
          editor_whatsapp: gallery.editorWhatsappNumber,
          photos_imported: drivePhotos.length,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create gallery error:", error);
    return NextResponse.json(
      { error: "Gagal membuat galeri", details: error.message },
      { status: 500 }
    );
  }
}
