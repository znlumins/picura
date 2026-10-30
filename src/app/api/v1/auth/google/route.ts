import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name, google_id, avatar_url } = body;

    const userEmail = email || "fotografer@picura.id";
    const userName = name || "Fotografer Studio Picura";

    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userName,
          googleId: google_id || `google_${Date.now()}`,
          avatarUrl: avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          subscriptionTier: "FREEMIUM",
        },
      });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      tier: user.subscriptionTier,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return NextResponse.json({
      status: "success",
      message: "Authentication successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        subscriptionTier: user.subscriptionTier,
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: 900, // 15 mins
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Authentication failed", details: error.message },
      { status: 500 }
    );
  }
}
