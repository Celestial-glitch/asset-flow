"use server";

import { prisma } from "@/lib/prisma";
import { AssetStatus, BookingStatus } from "@prisma/client";

export async function getDashboardMetrics() {
  const assetsAvailable = await prisma.asset.count({
    where: { status: AssetStatus.AVAILABLE }
  });

  const assetsAllocated = await prisma.asset.count({
    where: { status: AssetStatus.ALLOCATED }
  });

  const activeBookings = await prisma.resourceBooking.count({
    where: { 
      status: { in: [BookingStatus.UPCOMING, BookingStatus.ONGOING] }
    }
  });

  // Calculate start of today for maintenance tracking
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const maintenanceToday = await prisma.maintenanceRequest.count({
    where: {
      dateRequested: { gte: startOfDay }
    }
  });

  return {
    assetsAvailable,
    assetsAllocated,
    activeBookings,
    maintenanceToday
  };
}
