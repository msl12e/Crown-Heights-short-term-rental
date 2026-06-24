"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export type FormState = { error?: string };

export async function createBookingAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "GUEST") {
    return { error: "Only guest accounts can request bookings." };
  }

  const propertyId = String(formData.get("propertyId") ?? "");
  const checkInStr = String(formData.get("checkIn") ?? "");
  const checkOutStr = String(formData.get("checkOut") ?? "");
  const guests = Number(formData.get("guests"));
  const message = String(formData.get("message") ?? "").trim();

  if (!propertyId || !checkInStr || !checkOutStr) {
    return { error: "Please choose your check-in and check-out dates." };
  }

  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    return { error: "Invalid dates." };
  }
  if (checkOut <= checkIn) {
    return { error: "Check-out must be after check-in." };
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  if (!property || property.status !== "APPROVED") {
    return { error: "This property is not available for booking." };
  }

  await prisma.booking.create({
    data: {
      propertyId,
      guestId: user.id,
      checkIn,
      checkOut,
      guests: Number.isFinite(guests) && guests > 0 ? Math.round(guests) : 1,
      message,
    },
  });

  redirect("/dashboard/bookings?requested=1");
}

async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { property: true },
  });
  if (!booking) throw new Error("NOT_FOUND");

  const isHost = booking.property.hostId === user.id;
  const isAdmin = user.role === "ADMIN";
  const isGuestCancelling =
    booking.guestId === user.id && status === "CANCELLED";

  if (!isHost && !isAdmin && !isGuestCancelling) {
    throw new Error("FORBIDDEN");
  }

  await prisma.booking.update({ where: { id: bookingId }, data: { status } });
  revalidatePath("/dashboard/host");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/admin");
}

export async function confirmBookingAction(formData: FormData): Promise<void> {
  await updateBookingStatus(String(formData.get("bookingId")), "CONFIRMED");
}

export async function declineBookingAction(formData: FormData): Promise<void> {
  await updateBookingStatus(String(formData.get("bookingId")), "DECLINED");
}

export async function cancelBookingAction(formData: FormData): Promise<void> {
  await updateBookingStatus(String(formData.get("bookingId")), "CANCELLED");
}
