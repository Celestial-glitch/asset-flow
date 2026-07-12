"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { MaintenancePriority, MaintenanceStatus, AssetStatus } from "@prisma/client";

export async function raiseRequest(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const assetId = formData.get("assetId") as string;
  const issueDescription = formData.get("issueDescription") as string;
  const priority = formData.get("priority") as MaintenancePriority;

  if (!assetId || !issueDescription || !priority) {
    throw new Error("Missing required fields for maintenance request.");
  }

  await prisma.maintenanceRequest.create({
    data: {
      assetId,
      requestedById: session.user.id!,
      issueDescription,
      priority,
      status: MaintenanceStatus.PENDING,
    }
  });

  revalidatePath("/maintenance");
  revalidatePath("/");
}

export async function updateMaintenanceStatus(requestId: string, newStatus: MaintenanceStatus) {
  const session = await auth();
  
  // Restrict approval capabilities strictly to Asset Managers and Admins
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "ASSET_MANAGER")) {
    throw new Error("Unauthorized. Only Asset Managers can approve or transition requests.");
  }

  // Use an atomic transaction to ensure the Request and the Asset are perfectly synced
  await prisma.$transaction(async (tx) => {
    const request = await tx.maintenanceRequest.findUnique({
      where: { id: requestId },
      select: { assetId: true, status: true }
    });

    if (!request) {
      throw new Error("Maintenance request not found.");
    }

    // Update the actual request status
    await tx.maintenanceRequest.update({
      where: { id: requestId },
      data: { status: newStatus }
    });

    // Synchronize the core Asset status based on workflow rules
    if (newStatus === MaintenanceStatus.APPROVED || newStatus === MaintenanceStatus.IN_PROGRESS) {
      await tx.asset.update({
        where: { id: request.assetId },
        data: { status: AssetStatus.MAINTENANCE }
      });
    } else if (newStatus === MaintenanceStatus.RESOLVED) {
      // Release asset back to available once resolved
      await tx.asset.update({
        where: { id: request.assetId },
        data: { status: AssetStatus.AVAILABLE }
      });
    }
  });

  revalidatePath("/maintenance");
  revalidatePath("/assets");
  revalidatePath("/");
}

export async function getAllMaintenanceRequests() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return await prisma.maintenanceRequest.findMany({
    include: {
      asset: {
        select: { name: true, assetTag: true }
      },
      requestedBy: {
        select: { name: true }
      }
    },
    orderBy: { dateRequested: 'desc' }
  });
}
