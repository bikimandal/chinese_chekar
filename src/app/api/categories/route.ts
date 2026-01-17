import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentStoreId, getDefaultStoreBySlug } from "@/lib/store";

// GET - Get all active categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";

    // Get store ID: admin uses current store, public uses default store
    let storeId: string;
    if (admin) {
      const currentStoreId = await getCurrentStoreId();
      if (!currentStoreId) {
        return NextResponse.json(
          { error: "No store selected" },
          { status: 401 }
        );
      }
      storeId = currentStoreId;
    } else {
      storeId = await getDefaultStoreBySlug();
    }

    const categories = await prisma.category.findMany({
      where: {
        storeId,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            items: {
              where: {
                isVisible: true,
                storeId, // Ensure items belong to same store
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

