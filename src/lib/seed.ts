import prisma from "./prisma";
import { hashPassword } from "./auth";
import { fetchDrivePhotos } from "./google-drive";

export async function ensureSeedData() {
  // Check if default user exists
  let user = await prisma.user.findUnique({
    where: { email: "demo@picura.id" },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "demo@picura.id",
        name: "Arka Sinema & Photography",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        subscriptionTier: "FREEMIUM",
      },
    });
  }

  // Check if initial gallery exists
  const count = await prisma.gallery.count({
    where: { userId: user.id },
  });

  if (count === 0) {
    const passwordHash = await hashPassword("123456");
    const gallery = await prisma.gallery.create({
      data: {
        userId: user.id,
        title: "The Wedding of Radit & Vanya",
        slug: "wedding-radit-vanya",
        googleDriveFolderId: "1WeddingRaditVanyaDriveFolderId",
        maxSelectionQuota: 20,
        passwordHash: passwordHash, // Protected with PIN 123456
        editorWhatsappNumber: "6281234567890",
        status: "ACTIVE",
      },
    });

    // Populate photo cache
    const photos = await fetchDrivePhotos(gallery.googleDriveFolderId);
    for (const p of photos) {
      await prisma.photoCache.create({
        data: {
          galleryId: gallery.id,
          driveFileId: p.id,
          fileName: p.name,
          thumbnailUrl: p.thumbnailUrl,
          webContentLink: p.previewUrl,
        },
      });
    }

    // Create a second demo gallery (public, no password)
    const gallery2 = await prisma.gallery.create({
      data: {
        userId: user.id,
        title: "Graduation Session - Sarah UI 2026",
        slug: "graduation-sarah-ui-2026",
        googleDriveFolderId: "1GraduationSarahUIDriveFolderId",
        maxSelectionQuota: 10,
        passwordHash: null,
        editorWhatsappNumber: "6289876543210",
        status: "ACTIVE",
      },
    });

    const photos2 = await fetchDrivePhotos(gallery2.googleDriveFolderId);
    for (const p of photos2) {
      await prisma.photoCache.create({
        data: {
          galleryId: gallery2.id,
          driveFileId: p.id,
          fileName: p.name,
          thumbnailUrl: p.thumbnailUrl,
          webContentLink: p.previewUrl,
        },
      });
    }
  }

  return user;
}
