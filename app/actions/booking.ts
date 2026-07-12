"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { BookingStatus } from "@prisma/client";

export async function createBooking(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const assetId = formData.get("assetId") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;

  if (!assetId || !startTimeStr || !endTimeStr) {
    throw new Error("Asset ID, Start Time, and End Time are required.");
  }

  const newStart = new Date(startTimeStr);
  const newEnd = new Date(endTimeStr);

  if (newStart >= newEnd) {
    throw new Error("End time must be strictly after the start time.");
  }

  if (newStart < new Date()) {
    throw new Error("Bookings cannot be scheduled in the past.");
  }

  // Strict algorithmic validation using a transaction
  await prisma.$transaction(async (tx) => {
    // 1. Verify asset exists and is explicitly marked as shared/bookable
    const asset = await tx.asset.findUnique({
      where: { id: assetId }
    });

    if (!asset || !asset.isSharedBookable) {
      throw new Error("This asset is not registered as a shared bookable resource.");
    }

    // 2. Strict Mathematical Overlap check
    // An overlap occurs if: (existing_start < new_end) AND (existing_end > new_start)
    // We only check against active bookings (UPCOMING or ONGOING)
    const overlappingBookings = await tx.resourceBooking.findMany({
      where: {
        assetId,
        status: { in: [BookingStatus.UPCOMING, BookingStatus.ONGOING] },
        AND: [
          { startTime: { lt: newEnd } },
          { endTime: { gt: newStart } }
        ]
      }
    });

    if (overlappingBookings.length > 0) {
      throw new Error("Booking failed: Your requested time window overlaps with an existing reservation.");
    }

    // 3. Create the booking securely
    await tx.resourceBooking.create({
      data: {
        assetId,
        userId: session.user.id!,
        startTime: newStart,
        endTime: newEnd,
        status: BookingStatus.UPCOMING
      }
    });
  });

  revalidatePath("/bookings");
  revalidatePath("/");
}

export async function getAllBookings() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.resourceBooking.findMany({
    include: {
      asset: {
        select: { name: true, assetTag: true }
      },
      user: {
        select: { name: true }
      }
    },
    orderBy: { startTime: 'desc' }
  });
}
