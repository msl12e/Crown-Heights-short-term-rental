import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@crownheights.com" },
    update: {},
    create: {
      name: "Site Admin",
      email: "admin@crownheights.com",
      passwordHash: password,
      role: "ADMIN",
    },
  });

  const host = await prisma.user.upsert({
    where: { email: "host@crownheights.com" },
    update: {},
    create: {
      name: "Maya Host",
      email: "host@crownheights.com",
      passwordHash: password,
      role: "HOST",
    },
  });

  const guest = await prisma.user.upsert({
    where: { email: "guest@crownheights.com" },
    update: {},
    create: {
      name: "Greg Guest",
      email: "guest@crownheights.com",
      passwordHash: password,
      role: "GUEST",
    },
  });

  const properties = [
    {
      title: "Sunny Brownstone Studio",
      location: "Crown Heights, Brooklyn",
      description:
        "A bright, recently renovated studio just steps from the Brooklyn Museum and Prospect Park. Perfect for solo travelers or couples.",
      pricePerNight: 120,
      bedrooms: 1,
      maxGuests: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
      status: "APPROVED" as const,
    },
    {
      title: "Cozy 2BR Garden Apartment",
      location: "Crown Heights, Brooklyn",
      description:
        "Spacious two-bedroom with a private garden, full kitchen, and easy access to the 3/4/5 trains. Great for families.",
      pricePerNight: 210,
      bedrooms: 2,
      maxGuests: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
      status: "APPROVED" as const,
    },
    {
      title: "Modern Loft Near Franklin Ave",
      location: "Crown Heights, Brooklyn",
      description:
        "Stylish open-plan loft with high ceilings, exposed brick, and a rooftop terrace. Surrounded by cafés and restaurants.",
      pricePerNight: 175,
      bedrooms: 1,
      maxGuests: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
      status: "PENDING" as const,
    },
  ];

  for (const data of properties) {
    const existing = await prisma.property.findFirst({
      where: { title: data.title, hostId: host.id },
    });
    if (!existing) {
      await prisma.property.create({ data: { ...data, hostId: host.id } });
    }
  }

  const approved = await prisma.property.findFirst({
    where: { status: "APPROVED", hostId: host.id },
  });

  if (approved) {
    const existingBooking = await prisma.booking.findFirst({
      where: { propertyId: approved.id, guestId: guest.id },
    });
    if (!existingBooking) {
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + 14);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 3);
      await prisma.booking.create({
        data: {
          propertyId: approved.id,
          guestId: guest.id,
          checkIn,
          checkOut,
          guests: 2,
          message: "Looking forward to our stay!",
        },
      });
    }
  }

  console.log("Seed complete.");
  console.log("  Admin: admin@crownheights.com / password123");
  console.log("  Host:  host@crownheights.com  / password123");
  console.log("  Guest: guest@crownheights.com / password123");
  void admin;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
