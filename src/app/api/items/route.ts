import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentStoreId, getDefaultStoreBySlug } from "@/lib/store";

// GET - Get all visible items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const admin = searchParams.get("admin") === "true";
    
    // Get store ID: admin uses current store, public uses default store
    let storeId: string;
    if (admin) {
      const currentStoreId = await getCurrentStoreId();
      if (!currentStoreId) {
        console.error("No store selected - cookie not set");
        return NextResponse.json(
          { error: "No store selected" },
          { status: 401 }
        );
      }
      storeId = currentStoreId;
    } else {
      // Public route - always use default store
      storeId = await getDefaultStoreBySlug();
    }

    const where: any = {
      storeId,
      ...(admin ? {} : { isVisible: true }),
    };

    if (category) {
      where.category = {
        name: category,
        isActive: true,
        storeId, // Ensure category belongs to same store
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        category: true,
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch items",
        message: error?.message || "Unknown error",
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Create new item (admin only)
export async function POST(request: Request) {
  try {
    const storeId = await getCurrentStoreId();
    if (!storeId) {
      return NextResponse.json(
        { error: "No store selected" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, price, stock, productId, isAvailable, isVisible } = body;

    // Optimized: Only fetch image field if productId exists
    let image = null;
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId, storeId }, // Ensure product belongs to same store
        select: { image: true },
      });
      if (product?.image) {
        image = product.image;
      }
    }

    const item = await prisma.item.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        image,
        categoryId: null, // No longer required
        productId: productId || null,
        storeId, // Always include storeId
        isAvailable: isAvailable ?? true,
        isVisible: isVisible ?? true,
      },
      include: {
        category: true,
        product: true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}

