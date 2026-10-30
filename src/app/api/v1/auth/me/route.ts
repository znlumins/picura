import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, generateAccessToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      if (decoded?.userId) {
        userId = decoded.userId;
      }
    }

    if (!userId) {
      return NextResponse.json({
        status: "unauthenticated",
        user: null,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({
        status: "unauthenticated",
        user: null,
      });
    }

    const activeGalleriesCount = await prisma.gallery.count({
      where: { userId: user.id, status: "ACTIVE" },
    });

    const totalSelectionsCount = await prisma.selection.count({
      where: { gallery: { userId: user.id } },
    });

    const totalPhotosCached = await prisma.photoCache.count({
      where: { gallery: { userId: user.id } },
    });

    const quotaLimit = user.subscriptionTier === "FREEMIUM" ? 2 : 999;

    return NextResponse.json({
      status: "success",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        studioName: user.studioName,
        studioWhatsapp: user.studioWhatsapp,
        hasGoogleApiKey: !!user.googleApiKey,
        subscriptionTier: user.subscriptionTier,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
      },
      stats: {
        activeGalleries: activeGalleriesCount,
        quotaLimit: quotaLimit,
        canCreateMore: activeGalleriesCount < quotaLimit,
        totalSelections: totalSelectionsCount,
        totalPhotos: totalPhotosCached,
      },
      token: generateAccessToken({
        userId: user.id,
        email: user.email,
        tier: user.subscriptionTier,
      }),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan";
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: msg },
      { status: 500 }
    );
  }
}
