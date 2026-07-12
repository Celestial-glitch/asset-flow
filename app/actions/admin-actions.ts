"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

export async function createDepartment(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  
  if (!name) throw new Error("Name is required");

  await prisma.department.create({
    data: { name, description }
  });
  revalidatePath("/admin/departments");
}

export async function createAssetCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const requiresWarrantyTracking = formData.get("requiresWarrantyTracking") === "on";

  if (!name) throw new Error("Name is required");

  await prisma.assetCategory.create({
    data: { name, description, requiresWarrantyTracking }
  });
  revalidatePath("/admin/categories");
}

export async function updateEmployeeRole(userId: string, newRole: UserRole) {
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });
  revalidatePath("/admin/directory");
}
