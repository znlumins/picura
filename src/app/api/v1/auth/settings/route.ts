import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const decoded = verifyToken(authHeader.substring(7));
      if (decoded?.userId) {
        userId = decoded.userId;
      }
    }

    if (!userId) {
      const demoUser = await prisma.user.findFirst({ where: { email: "demo@picura.id" } });
      if (demoUser) userId = demoUser.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, studio_name, studio_whatsapp, google_api_key } = body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(studio_name !== undefined ? { studioName: studio_name?.trim() || null } : {}),
        ...(studio_whatsapp !== undefined ? { studioWhatsapp: studio_whatsapp?.trim() || null } : {}),
        ...(google_api_key !== undefined ? { googleApiKey: google_api_key?.trim() || null } : {}),
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Pengaturan berhasil diperbarui",
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        studioName: updated.studioName,
        studioWhatsapp: updated.studioWhatsapp,
        hasGoogleApiKey: !!updated.googleApiKey,
        subscriptionTier: updated.subscriptionTier,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal menyimpan pengaturan", details: error.message }, { status: 500 });
  }
}
