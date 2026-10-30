import prisma from "./prisma";

export async function ensureSeedData() {
  // Check if primary account exists, if not create empty baseline without fake galleries
  let user = await prisma.user.findFirst({
    where: { email: "admin@picura.id" },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "admin@picura.id",
        name: "Fotografer Studio",
        subscriptionTier: "PRO_FREELANCE",
      },
    });
  }

  return user;
}
