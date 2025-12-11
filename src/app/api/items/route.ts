import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get all visible items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const admin = searchParams.get("admin") === "true";
    const where: any = admin ? {} : { isVisible: true };

    if (category) {
      where.category = {
        name: category,
        isActive: true,
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
    const body = await request.json();
    const { name, description, price, stock, productId, isAvailable, isVisible } = body;

    // Get product to use its image if available
    let image = null;
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
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

