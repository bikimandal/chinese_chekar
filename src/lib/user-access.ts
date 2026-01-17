import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { createClient } from "@supabase/supabase-js";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

/**
 * Get current authenticated user from session
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;

    if (!accessToken) {
      return null;
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      include: {
        storeAccess: {
          include: {
            store: true,
          },
        },
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Check if user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === UserRole.ADMIN;
}

/**
 * Get stores the current user has access to
 */
export async function getUserStores() {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  // Admin has access to all stores
  if (user.role === UserRole.ADMIN) {
    return await prisma.store.findMany({
      where: { isActive: true },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    });
  }

  // User only has access to assigned stores
  return user.storeAccess.map((us) => us.store).filter((s) => s.isActive);
}

/**
 * Check if user has access to a specific store
 */
export async function hasStoreAccess(storeId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }

  // Admin has access to all stores
  if (user.role === UserRole.ADMIN) {
    return true;
  }

  // Check if user has access to this store
  return user.storeAccess.some((us) => us.storeId === storeId);
}

/**
 * Check if user can manage stores (create/edit/delete)
 */
export async function canManageStores(): Promise<boolean> {
  return await isAdmin();
}

/**
 * Check if user can manage users (create/edit/delete)
 */
export async function canManageUsers(): Promise<boolean> {
  return await isAdmin();
}
