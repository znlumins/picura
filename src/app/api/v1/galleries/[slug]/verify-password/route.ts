import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { verifyPassword } from "@/lib/auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "picura-super-secret-jwt-key-2026-default-dev";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 5 attempts per minute per IP for password challenge (TRD 3.3)
    const rateLimit = checkRateLimit(`ratelimit:auth:${params.slug}:${ip}`, 5, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "TOO_MANY_ATTEMPTS",
          message: "Terlalu banyak percobaan sandi yang salah. Silakan coba lagi dalam 1 menit.",
        },
        { status: 429 }
      );
    }

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

    if (!gallery.passwordHash) {
      return NextResponse.json({
        status: "success",
        message: "Galeri tidak diproteksi kata sandi",
      });
    }

    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password wajib diisi" },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(password, gallery.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        {
          error: "INVALID_PASSWORD",
          message: "Password yang Anda masukkan salah. Silakan coba lagi.",
          remaining_attempts: rateLimit.remaining,
        },
        { status: 401 }
      );
    }

    // Issue gallery-scoped access token (valid 24 hours for client browsing)
    const galleryToken = jwt.sign(
      {
        galleryId: gallery.id,
        slug: gallery.slug,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return NextResponse.json({
      status: "success",
      message: "Verifikasi berhasil",
      token: galleryToken,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal memverifikasi kata sandi", details: error.message },
      { status: 500 }
    );
  }
}
