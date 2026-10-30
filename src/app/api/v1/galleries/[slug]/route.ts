import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`ratelimit:gallery:${ip}`, 60, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "RATE_LIMIT_EXCEEDED",
          message: "Terlalu banyak permintaan. Silakan tunggu beberapa saat.",
        },
        { status: 429 }
      );
    }

    const { slug } = params;
    const gallery = await prisma.gallery.findUnique({
      where: { slug },
      include: {
        photos: {
          orderBy: { createdAt: "asc" },
        },
        user: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!gallery) {
      return NextResponse.json(
        { error: "Galeri tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check expiration
    if (gallery.expiresAt && new Date() > new Date(gallery.expiresAt)) {
      return NextResponse.json(
        {
          error: "GALLERY_EXPIRED",
          message: "Masa aktif tautan galeri ini telah berakhir.",
        },
        { status: 410 }
      );
    }

    const isPasswordProtected = !!gallery.passwordHash;

    // Check if gallery access token is provided
    let hasAccess = !isPasswordProtected;
    if (isPasswordProtected) {
      const authHeader = req.headers.get("x-gallery-token") || req.headers.get("authorization");
      const token = authHeader?.replace("Bearer ", "");
      if (token) {
        const decoded = verifyToken(token);
        if (decoded && (decoded as any).galleryId === gallery.id) {
          hasAccess = true;
        }
      }
    }

    // If password-protected and not unlocked, return masked response
    if (isPasswordProtected && !hasAccess) {
      return NextResponse.json({
        status: "locked",
        is_password_protected: true,
        data: {
          id: gallery.id,
          title: gallery.title,
          slug: gallery.slug,
          photographer: {
            name: gallery.user.name,
            avatar: gallery.user.avatarUrl,
          },
          total_photos: gallery.photos.length,
          max_selection_quota: gallery.maxSelectionQuota,
        },
      });
    }

    // Full photo list
    const formattedPhotos = gallery.photos.map((p) => ({
      id: p.id,
      drive_file_id: p.driveFileId,
      filename: p.fileName,
      thumbnail_url: p.thumbnailUrl,
      preview_url: p.webContentLink || p.thumbnailUrl,
    }));

    return NextResponse.json({
      status: "success",
      is_password_protected: isPasswordProtected,
      data: {
        id: gallery.id,
        title: gallery.title,
        slug: gallery.slug,
        photographer: {
          name: gallery.user.name,
          avatar: gallery.user.avatarUrl,
        },
        max_selection_quota: gallery.maxSelectionQuota,
        editor_whatsapp: gallery.editorWhatsappNumber,
        status: gallery.status,
        expires_at: gallery.expiresAt,
        photos: formattedPhotos,
      },
    });
  } catch (error: any) {
    console.error("Get gallery detail error:", error);
    return NextResponse.json(
      { error: "Gagal memuat galeri", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const gallery = await prisma.gallery.findUnique({
      where: { slug },
    });

    if (!gallery) {
      return NextResponse.json(
        { error: "Galeri tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.gallery.delete({
      where: { id: gallery.id },
    });

    return NextResponse.json({
      status: "success",
      message: "Galeri berhasil dihapus",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal menghapus galeri", details: error.message },
      { status: 500 }
    );
  }
}
