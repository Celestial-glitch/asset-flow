"use server";

import { prisma } from "@/lib/prisma";
import { AllocationStatus } from "@prisma/client";
import { auth } from "@/auth";

export async function getDepartmentAllocations() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const allocations = await prisma.allocation.findMany({
    where: { 
      status: AllocationStatus.ACTIVE,
      departmentId: { not: null }
    },
    include: { department: { select: { name: true } } }
  });

  // Aggregate in memory since Prisma groupBy doesn't fully support relation fields
  const grouped = allocations.reduce((acc: Record<string, number>, alloc) => {
    const deptName = alloc.department?.name || "Unassigned";
    acc[deptName] = (acc[deptName] || 0) + 1;
    return acc;
  }, {});

  // Convert to array format perfectly suited for Recharts
  return Object.keys(grouped).map(key => ({
    name: key,
    value: grouped[key]
  }));
}

export async function getMaintenanceFrequency() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const maintenance = await prisma.maintenanceRequest.findMany({
    include: { 
      asset: { 
        include: { category: { select: { name: true } } } 
      } 
    }
  });

  const grouped = maintenance.reduce((acc: Record<string, number>, req) => {
    const categoryName = req.asset?.category?.name || "Unknown";
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(grouped).map(key => ({
    name: key,
    value: grouped[key]
  }));
}

export async function getOverdueAssets() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const now = new Date();

  return await prisma.allocation.findMany({
    where: {
      status: AllocationStatus.ACTIVE,
      expectedReturnDate: { lt: now }
    },
    include: {
      asset: { select: { name: true, assetTag: true } },
      user: { select: { name: true, email: true } },
      department: { select: { name: true } }
    },
    orderBy: { expectedReturnDate: 'asc' }
  });
}
