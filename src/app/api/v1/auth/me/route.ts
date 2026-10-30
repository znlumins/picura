import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";
import { verifyToken, generateAccessToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await ensureSeedData();

    // Check authorization header
    const authHeader = req.headers.get("authorization");
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      }
    }

    // Default to the primary demo user if no token provided for seamless DX
    let user;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    }

    if (!user) {
      user = await prisma.user.findFirst({
        where: { email: "demo@picura.id" },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate gallery quota usage
    const activeGalleriesCount = await prisma.gallery.count({
      where: { userId: user.id, status: "ACTIVE" },
    });

    const totalSelectionsCount = await prisma.selection.count({
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
        subscriptionTier: user.subscriptionTier,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
      },
      stats: {
        activeGalleries: activeGalleriesCount,
        quotaLimit: quotaLimit,
        canCreateMore: activeGalleriesCount < quotaLimit,
        totalSelections: totalSelectionsCount,
      },
      token: generateAccessToken({
        userId: user.id,
        email: user.email,
        tier: user.subscriptionTier,
      }),
    });
  } catch (error: any) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
