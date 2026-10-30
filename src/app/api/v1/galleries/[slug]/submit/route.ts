import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const ip = getClientIp(req);
    // Rate limit submission: 15 submissions per minute per IP
    const rateLimit = checkRateLimit(`ratelimit:submit:${params.slug}:${ip}`, 15, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "RATE_LIMIT_EXCEEDED",
          message: "Terlalu banyak permintaan simpan pilihan. Silakan tunggu sebentar.",
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

    const body = await req.json();
    const { client_name, client_notes, selected_files } = body;

    if (!Array.isArray(selected_files) || selected_files.length === 0) {
      return NextResponse.json(
        { error: "Pilih minimal 1 foto sebelum mengirimkan pilihan." },
        { status: 400 }
      );
    }

    if (gallery.maxSelectionQuota > 0 && selected_files.length > gallery.maxSelectionQuota) {
      return NextResponse.json(
        {
          error: "QUOTA_EXCEEDED",
          message: `Jumlah foto yang dipilih (${selected_files.length}) melebihi kuota maksimal (${gallery.maxSelectionQuota} foto).`,
          max_quota: gallery.maxSelectionQuota,
          selected_count: selected_files.length,
        },
        { status: 400 }
      );
    }

    const filenames = selected_files.map((f: any) => f.filename || f.name || f.file_id);

    // Save selection log in database
    const selection = await prisma.selection.create({
      data: {
        galleryId: gallery.id,
        clientName: client_name?.trim() || "Klien Picura",
        clientNotes: client_notes?.trim() || null,
        selectedPhotoIds: JSON.stringify(selected_files),
        totalSelected: selected_files.length,
      },
    });

    // Update gallery status to COMPLETED
    await prisma.gallery.update({
      where: { id: gallery.id },
      data: { status: "COMPLETED" },
    });

    // Generate WhatsApp deep link & web link
    const wa = generateWhatsAppLink(
      gallery.editorWhatsappNumber,
      gallery.title,
      filenames,
      client_name,
      client_notes
    );

    return NextResponse.json({
      status: "success",
      message: "Pilihan foto berhasil disimpan",
      data: {
        selection_id: selection.id,
        total_selected: selection.totalSelected,
        whatsapp_url: wa.deepLink,
        whatsapp_web_url: wa.webLink,
        message_text: wa.rawMessage,
        editor_phone: wa.phoneNumber,
      },
    });
  } catch (error: any) {
    console.error("Submit selection error:", error);
    return NextResponse.json(
      { error: "Gagal memproses seleksi foto", details: error.message },
      { status: 500 }
    );
  }
}
