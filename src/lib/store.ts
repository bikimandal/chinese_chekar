import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { hasStoreAccess } from "./user-access";

/**
 * Get the current store ID from session (for admin panel)
 */
export async function getCurrentStoreId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const storeId = cookieStore.get("current-store-id")?.value;
    return storeId || null;
  } catch (error) {
    console.error("Error getting current store ID:", error);
    return null;
  }
}

/**
 * Get the default store ID (for public frontend)
 * This is the store marked as isDefault=true
 */
export async function getDefaultStoreId(): Promise<string> {
  try {
    const defaultStore = await prisma.store.findFirst({
      where: { isDefault: true, isActive: true },
      select: { id: true },
    });

    if (!defaultStore) {
      throw new Error("No default store found. Please create a default store.");
    }

    return defaultStore.id;
  } catch (error) {
    console.error("Error getting default store ID:", error);
    throw error;
  }
}

/**
 * Get default store by slug (for environment variable support)
 */
export async function getDefaultStoreBySlug(slug?: string): Promise<string> {
  try {
    const storeSlug = slug || process.env.NEXT_PUBLIC_DEFAULT_STORE_SLUG || "chinese-chekar";
    
    const defaultStore = await prisma.store.findFirst({
      where: {
        OR: [
          { isDefault: true, isActive: true },
          { slug: storeSlug, isActive: true },
        ],
      },
      select: { id: true },
      orderBy: { isDefault: "desc" }, // Prefer isDefault=true
    });

    if (!defaultStore) {
      throw new Error(`No default store found with slug "${storeSlug}". Please create a default store.`);
    }

    return defaultStore.id;
  } catch (error) {
    console.error("Error getting default store by slug:", error);
    throw error;
  }
}

/**
 * Set the current store ID in session (for admin panel)
 */
export async function setCurrentStoreId(storeId: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set("current-store-id", storeId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
  } catch (error) {
    console.error("Error setting current store ID:", error);
    throw error;
  }
}

/**
 * Validate that a user has access to a store
 * Checks both store existence/active status and user permissions
 */
export async function validateStoreAccess(
  storeId: string,
  userId?: string
): Promise<boolean> {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, isActive: true },
    });

    if (!store || !store.isActive) {
      return false;
    }

    // Check if user has access to this store
    return await hasStoreAccess(storeId);
  } catch (error) {
    console.error("Error validating store access:", error);
    return false;
  }
}

/**
 * Get all active stores
 */
export async function getAllStores() {
  try {
    return await prisma.store.findMany({
      where: { isActive: true },
      orderBy: [
        { isDefault: "desc" },
        { name: "asc" },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        isDefault: true,
        isActive: true,
      },
    });
  } catch (error) {
    console.error("Error getting all stores:", error);
    return [];
  }
}
