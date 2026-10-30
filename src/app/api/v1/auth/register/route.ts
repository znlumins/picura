import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, generateAccessToken, generateRefreshToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, studio_name, whatsapp } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Nama fotografer wajib diisi" }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar. Silakan login." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        studioName: studio_name?.trim() || null,
        studioWhatsapp: whatsapp?.trim() || null,
        subscriptionTier: "FREEMIUM",
      },
    });

    const payload = {
      userId: user.id,
      email: user.email,
      tier: user.subscriptionTier,
    };

    const token = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return NextResponse.json({
      status: "success",
      message: "Registrasi akun berhasil",
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        studioName: user.studioName,
        subscriptionTier: user.subscriptionTier,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Gagal melakukan registrasi", details: error.message }, { status: 500 });
  }
}
