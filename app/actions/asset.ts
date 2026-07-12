"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { AssetStatus, AllocationStatus } from "@prisma/client";

export async function registerAsset(formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "ASSET_MANAGER")) {
    throw new Error("Unauthorized. Only Admins and Asset Managers can register assets.");
  }

  const assetTag = formData.get("assetTag") as string;
  const name = formData.get("name") as string;
  const categoryId = formData.get("categoryId") as string;
  const serialNumber = formData.get("serialNumber") as string | null;
  const condition = formData.get("condition") as string | null;
  const location = formData.get("location") as string | null;
  const isSharedBookable = formData.get("isSharedBookable") === "on";

  if (!assetTag || !name || !categoryId) {
    throw new Error("Missing required fields: Asset Tag, Name, and Category.");
  }

  await prisma.asset.create({
    data: {
      assetTag,
      name,
      categoryId,
      serialNumber,
      condition,
      location,
      isSharedBookable,
      status: AssetStatus.AVAILABLE,
    }
  });

  revalidatePath("/assets");
}

export async function getAllAssets() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized.");
  }

  return await prisma.asset.findMany({
    include: {
      category: true,
      allocations: {
        where: {
          status: AllocationStatus.ACTIVE
        },
        include: {
          user: true,
          department: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function allocateAsset(formData: FormData) {
  const session = await auth();
  
  // Checking permissions: Assuming Dept Heads, Asset Managers, and Admins can allocate. 
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "ASSET_MANAGER" && session.user.role !== "DEPARTMENT_HEAD")) {
    throw new Error("Unauthorized.");
  }

  const assetId = formData.get("assetId") as string;
  const userId = formData.get("userId") as string;
  const expectedReturnDateStr = formData.get("expectedReturnDate") as string | null;
  
  if (!assetId || !userId) {
    throw new Error("Asset ID and User ID are required.");
  }

  // Strict algorithmic validation via transaction to prevent double allocation race conditions
  await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { id: assetId }
    });

    if (!asset) {
      throw new Error("Asset not found.");
    }

    if (asset.status !== AssetStatus.AVAILABLE) {
      throw new Error(`Asset is currently ${asset.status} and cannot be allocated. Please request a transfer instead.`);
    }

    // Determine the user's department for the allocation record
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { departmentId: true }
    });

    // Create active allocation
    await tx.allocation.create({
      data: {
        assetId,
        userId,
        departmentId: user?.departmentId,
        expectedReturnDate: expectedReturnDateStr ? new Date(expectedReturnDateStr) : null,
        status: AllocationStatus.ACTIVE,
      }
    });

    // Update asset status
    await tx.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.ALLOCATED }
    });
  });

  revalidatePath("/assets");
  revalidatePath("/allocation");
}
