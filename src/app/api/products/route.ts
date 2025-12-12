import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, image, hasHalfFullPlate, halfPlatePrice, fullPlatePrice } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        image: image?.trim() || null,
        hasHalfFullPlate: hasHalfFullPlate ?? true,
        halfPlatePrice: hasHalfFullPlate && halfPlatePrice ? parseFloat(halfPlatePrice) : null,
        // When toggle is off, the form sends price as fullPlatePrice, so always use fullPlatePrice if provided
        fullPlatePrice: fullPlatePrice ? parseFloat(fullPlatePrice) : null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      meta: error.meta,
    });
    
    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { 
          error: "A product with this name already exists",
          details: error.meta?.target ? `Field: ${error.meta.target.join(", ")}` : undefined
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to create product",
        message: error.message || "Unknown error",
        details: process.env.NODE_ENV === "development" 
          ? {
              code: error.code,
              meta: error.meta,
              stack: error.stack,
            }
          : undefined
      },
      { status: 500 }
    );
  }
}

