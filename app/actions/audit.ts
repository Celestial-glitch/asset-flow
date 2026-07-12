"use server";
// Force TS update

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { AuditStatus, AuditItemStatus, AssetStatus } from "@prisma/client";

export async function createAuditCycle(formData: FormData) {
  const session = await auth();
  // Ensure only authorized roles can initiate audits
  if (!session?.user || session.user.role === "EMPLOYEE") {
    throw new Error("Unauthorized. Only Admins or Managers can create audit cycles.");
  }

  const name = formData.get("name") as string;
  const departmentId = formData.get("departmentId") as string | null;

  if (!name) throw new Error("Audit name is required.");

  await prisma.auditCycle.create({
    data: {
      name,
      departmentId: departmentId || null,
      conductedById: session.user.id!,
      status: AuditStatus.OPEN,
    }
  });

  revalidatePath("/audit");
}

export async function logAuditItem(auditCycleId: string, assetId: string, status: AuditItemStatus, notes?: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Upsert the item record for this specific asset in this specific audit cycle
  const existing = await prisma.auditItem.findFirst({
    where: { auditCycleId, assetId }
  });

  if (existing) {
    await prisma.auditItem.update({
      where: { id: existing.id },
      data: { status, notes }
    });
  } else {
    await prisma.auditItem.create({
      data: {
        auditCycleId,
        assetId,
        status,
        notes
      }
    });
  }

  revalidatePath(`/audit/${auditCycleId}`);
  revalidatePath("/audit");
}

export async function closeAuditCycle(auditCycleId: string) {
  const session = await auth();
  if (!session?.user || session.user.role === "EMPLOYEE") {
    throw new Error("Unauthorized to close audits.");
  }

  // Use a transaction to lock the audit and batch-process all master asset state updates
  await prisma.$transaction(async (tx) => {
    // 1. Lock the audit cycle
    await tx.auditCycle.update({
      where: { id: auditCycleId },
      data: { status: AuditStatus.CLOSED }
    });

    // 2. Fetch all recorded items in this cycle
    const items = await tx.auditItem.findMany({
      where: { auditCycleId }
    });

    // 3. Update master Asset statuses based on verification outcomes
    for (const item of items) {
      if (item.status === AuditItemStatus.MISSING) {
        await tx.asset.update({
          where: { id: item.assetId },
          data: { status: AssetStatus.LOST }
        });
      } else if (item.status === AuditItemStatus.DAMAGED) {
        // Automatically route damaged assets to the maintenance pipeline
        await tx.asset.update({
          where: { id: item.assetId },
          data: { status: AssetStatus.MAINTENANCE }
        });
      }
      // VERIFIED items are healthy and retain their current status (AVAILABLE/ALLOCATED)
    }
  });

  revalidatePath("/audit");
  revalidatePath("/assets");
  revalidatePath("/");
}

export async function getAuditCycles() {
  return await prisma.auditCycle.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      conductedBy: { select: { name: true } },
      department: { select: { name: true } },
      _count: { select: { items: true } }
    }
  });
}
