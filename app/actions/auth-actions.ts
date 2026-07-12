"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function loginUser(prevState: any, formData: FormData) {
  try {
    await signIn("credentials", { ...Object.fromEntries(formData), redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "An unexpected error occurred." };
      }
    }
    throw error;
  }
  redirect("/");
}

export async function signupUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { error: "Please fill in all fields." };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "A user with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: { 
        email, 
        passwordHash, 
        name, 
        role: "EMPLOYEE" // Enforced default role for signups
      }
    });

    // Automatically sign in after signup
    await signIn("credentials", { ...Object.fromEntries(formData), redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Failed to automatically sign in." };
    }
    throw error;
  }
  redirect("/");
}

export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}
