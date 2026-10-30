import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, hashPassword } from "@/lib/auth";
import { extractFolderId, fetchDrivePhotos, buildGoogleCdnUrl } from "@/lib/google-drive";
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

  return null;
}

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu", status: "unauthenticated" }, { status: 401 });
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
      let latestSelectedFiles: { file_id: string; filename: string }[] = [];
      let clientName = "";
      let clientNotes = "";
      let submittedAt: string | null = null;

      if (latestSelection) {
        latestSelectedCount = latestSelection.totalSelected;
        clientName = latestSelection.clientName || "Klien";
        clientNotes = latestSelection.clientNotes || "";
        submittedAt = latestSelection.submittedAt.toISOString();
        try {
          latestSelectedFiles = JSON.parse(latestSelection.selectedPhotoIds || "[]");
        } catch {
          latestSelectedFiles = [];
        }
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
        latestSelectedCount,
        latestSelection: latestSelection ? {
          clientName,
          clientNotes,
          totalSelected: latestSelectedCount,
          submittedAt,
          selectedFiles: latestSelectedFiles,
        } : null,
        progressPercent: g.maxSelectionQuota > 0 ? Math.min(100, Math.round((latestSelectedCount / g.maxSelectionQuota) * 100)) : 0,
      };
    });

    // Fetch real recent selections across all galleries of this user
    const recentSelections = await prisma.selection.findMany({
      where: {
        gallery: { userId: user.id },
      },
      include: {
        gallery: {
          select: {
            id: true,
            title: true,
            slug: true,
            editorWhatsappNumber: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
      take: 6,
    });

    const activities = recentSelections.map((s) => {
      let files: { file_id: string; filename: string }[] = [];
      try {
        files = JSON.parse(s.selectedPhotoIds || "[]");
      } catch {
        files = [];
      }

      return {
        id: s.id,
        galleryId: s.gallery.id,
        galleryTitle: s.gallery.title,
        gallerySlug: s.gallery.slug,
        editorWhatsapp: s.gallery.editorWhatsappNumber,
        clientName: s.clientName || "Klien",
        clientNotes: s.clientNotes,
        totalSelected: s.totalSelected,
        submittedAt: s.submittedAt.toISOString(),
        selectedFiles: files,
      };
    });

    const totalPhotosCached = await prisma.photoCache.count({
      where: { gallery: { userId: user.id } },
    });

    return NextResponse.json({
      status: "success",
      meta: {
        activeCount,
        quotaLimit,
        totalPhotosCached,
        canCreateMore: activeCount < quotaLimit,
        userTier: user.subscriptionTier,
      },
      data: formatted,
      activities,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan";
    console.error("Fetch galleries error:", error);
    return NextResponse.json(
      { error: "Gagal memuat galeri", details: msg },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu", status: "unauthenticated" }, { status: 401 });
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
      direct_files,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Judul galeri wajib diisi" },
        { status: 400 }
      );
    }

    const folderId = extractFolderId(drive_folder_url);
    if (!folderId && (!Array.isArray(direct_files) || direct_files.length === 0)) {
      return NextResponse.json(
        {
          error:
            "Link Google Drive tidak valid. Masukkan URL folder Google Drive atau daftar link file.",
        },
        { status: 400 }
      );
    }

    const whatsappNumber = normalizePhoneNumber(
      editor_whatsapp || user.studioWhatsapp || "081234567890"
    );

    const slug = generateSlug(title);
    const passwordHash = password ? await hashPassword(password) : null;

    let expiresDate: Date | null = null;
    if (expires_at) {
      expiresDate = new Date(expires_at);
      if (isNaN(expiresDate.getTime())) {
        expiresDate = null;
      }
    }

    // Fetch real Google Drive photos using API Key if provided
    let photos: { id: string; name: string }[] = [];

    // If direct files were given in manual input, use them directly
    if (Array.isArray(direct_files) && direct_files.length > 0) {
      photos = direct_files.map((df: { file_id: string; filename?: string }, idx: number) => ({
        id: df.file_id,
        name: df.filename || `FOTO_${String(idx + 1).padStart(3, "0")}.JPG`,
      }));
    } else if (folderId) {
      photos = await fetchDrivePhotos(folderId, user.googleApiKey || undefined);
    }

    if (photos.length === 0) {
      return NextResponse.json(
        {
          error:
            "Tidak dapat menemukan foto di Google Drive tersebut. Pastikan folder berstatus 'Anyone with the link can view' (Public).",
        },
        { status: 400 }
      );
    }

    // Create Gallery and PhotoCache records in transaction
    const gallery = await prisma.$transaction(async (tx) => {
      const createdGallery = await tx.gallery.create({
        data: {
          userId: user.id,
          title: title.trim(),
          slug,
          googleDriveFolderId: folderId || "manual_files",
          maxSelectionQuota: Number(max_selection_quota) || 20,
          passwordHash,
          editorWhatsappNumber: whatsappNumber,
          expiresAt: expiresDate,
          status: "ACTIVE",
        },
      });

      // Insert photos into PhotoCache
      await tx.photoCache.createMany({
        data: photos.map((p) => ({
          galleryId: createdGallery.id,
          driveFileId: p.id,
          fileName: p.name,
          thumbnailUrl: buildGoogleCdnUrl(p.id, 400),
          webContentLink: buildGoogleCdnUrl(p.id, 1600),
        })),
      });

      return createdGallery;
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Galeri berhasil dibuat dengan koneksi Google Drive nyata",
        data: {
          id: gallery.id,
          title: gallery.title,
          slug: gallery.slug,
          total_photos: photos.length,
          public_url: `/g/${gallery.slug}`,
          editor_whatsapp: gallery.editorWhatsappNumber,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan";
    console.error("Create gallery error:", error);
    return NextResponse.json(
      { error: "Gagal membuat galeri", details: msg },
      { status: 500 }
    );
  }
}
