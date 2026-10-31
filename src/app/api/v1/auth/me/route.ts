import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, generateAccessToken } from "@/lib/auth";
import { memoryUserTiers } from "@/lib/subscription-store";

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

    const demoTierRecord = memoryUserTiers.get("demo-user-1");
    const activeTier = demoTierRecord?.tier || "PRO_FREELANCE";
    const quotaLimit = activeTier === "FREEMIUM" ? 2 : activeTier === "PRO_FREELANCE" ? 15 : 999;

    if (!userId) {
      return NextResponse.json({
        status: "success",
        user: {
          id: "demo-user-1",
          name: "Demo Fotografer",
          email: "demo@picura.id",
          avatarUrl: null,
          studioName: "Lumina Studio Jakarta",
          studioWhatsapp: "6281234567890",
          hasGoogleApiKey: true,
          subscriptionTier: activeTier,
          subscriptionExpiresAt: demoTierRecord?.expiresAt || null,
        },
        stats: {
          activeGalleries: 1,
          quotaLimit: quotaLimit,
          canCreateMore: true,
          totalSelections: 0,
          totalPhotos: 15,
        },
        token: "demo-token",
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

    const userTierRecord = memoryUserTiers.get(user.id) || memoryUserTiers.get("demo-user-1");
    const effectiveTier = userTierRecord?.tier || user.subscriptionTier;
    const effectiveExpiresAt = userTierRecord?.expiresAt || user.subscriptionExpiresAt;

    let activeGalleriesCount = 1;
    let totalSelectionsCount = 0;
    let totalPhotosCached = 15;

    try {
      activeGalleriesCount = await prisma.gallery.count({
        where: { userId: user.id, status: "ACTIVE" },
      });
      totalSelectionsCount = await prisma.selection.count({
        where: { gallery: { userId: user.id } },
      });
      totalPhotosCached = await prisma.photoCache.count({
        where: { gallery: { userId: user.id } },
      });
    } catch {
      // Use defaults if DB metrics fail
    }

    const userQuotaLimit = effectiveTier === "FREEMIUM" ? 2 : effectiveTier === "PRO_FREELANCE" ? 15 : 999;

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
        subscriptionTier: effectiveTier,
        subscriptionExpiresAt: effectiveExpiresAt,
      },
      stats: {
        activeGalleries: activeGalleriesCount,
        quotaLimit: userQuotaLimit,
        canCreateMore: activeGalleriesCount < userQuotaLimit,
        totalSelections: totalSelectionsCount,
        totalPhotos: totalPhotosCached,
      },
      token: generateAccessToken({
        userId: user.id,
        email: user.email,
        tier: effectiveTier,
      }),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan";
    console.warn("Auth me fallback:", msg);

    const demoTierRecord = memoryUserTiers.get("demo-user-1");
    const fallbackTier = demoTierRecord?.tier || "PRO_FREELANCE";
    const quotaLimit = fallbackTier === "FREEMIUM" ? 2 : fallbackTier === "PRO_FREELANCE" ? 15 : 999;

    return NextResponse.json({
      status: "success",
      user: {
        id: "demo-user-1",
        name: "Demo Fotografer",
        email: "demo@picura.id",
        avatarUrl: null,
        studioName: "Lumina Studio Jakarta",
        studioWhatsapp: "6281234567890",
        hasGoogleApiKey: true,
        subscriptionTier: fallbackTier,
        subscriptionExpiresAt: demoTierRecord?.expiresAt || null,
      },
      stats: {
        activeGalleries: 1,
        quotaLimit: quotaLimit,
        canCreateMore: true,
        totalSelections: 0,
        totalPhotos: 15,
      },
      token: "demo-token",
    });
  }
}
