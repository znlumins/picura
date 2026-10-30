import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, generateAccessToken, generateRefreshToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      tier: user.subscriptionTier,
    };

    const token = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return NextResponse.json({
      status: "success",
      message: "Login berhasil",
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        studioName: user.studioName,
        subscriptionTier: user.subscriptionTier,
        googleApiKey: !!user.googleApiKey,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Gagal login", details: error.message }, { status: 500 });
  }
}
