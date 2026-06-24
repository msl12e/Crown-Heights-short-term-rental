"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export type FormState = { error?: string };

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop";

export async function createPropertyAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "HOST") {
    return { error: "Only hosts can submit properties." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || FALLBACK_IMAGE;
  const pricePerNight = Number(formData.get("pricePerNight"));
  const bedrooms = Number(formData.get("bedrooms"));
  const maxGuests = Number(formData.get("maxGuests"));

  if (!title || !location || !description) {
    return { error: "Title, location and description are required." };
  }
  if (!Number.isFinite(pricePerNight) || pricePerNight <= 0) {
    return { error: "Please enter a valid nightly price." };
  }

  await prisma.property.create({
    data: {
      title,
      location,
      description,
      imageUrl,
      pricePerNight: Math.round(pricePerNight),
      bedrooms: Number.isFinite(bedrooms) && bedrooms > 0 ? Math.round(bedrooms) : 1,
      maxGuests: Number.isFinite(maxGuests) && maxGuests > 0 ? Math.round(maxGuests) : 2,
      hostId: user.id,
    },
  });

  redirect("/dashboard/host?submitted=1");
}

async function setPropertyStatus(
  propertyId: string,
  status: "APPROVED" | "REJECTED",
): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  await prisma.property.update({ where: { id: propertyId }, data: { status } });
  revalidatePath("/dashboard/admin");
  revalidatePath("/properties");
}

export async function approvePropertyAction(formData: FormData): Promise<void> {
  await setPropertyStatus(String(formData.get("propertyId")), "APPROVED");
}

export async function rejectPropertyAction(formData: FormData): Promise<void> {
  await setPropertyStatus(String(formData.get("propertyId")), "REJECTED");
}
