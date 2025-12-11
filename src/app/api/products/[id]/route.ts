import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, image } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        image: image?.trim() || null,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error updating product:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A product with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if product is used by any items
    const itemsUsingProduct = await prisma.item.count({
      where: { productId: id },
    });

    if (itemsUsingProduct > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete product. It is being used by ${itemsUsingProduct} item(s).`,
        },
        { status: 400 }
      );
    }

    // Get product to find image path before deleting
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Delete from database first
    await prisma.product.delete({
      where: { id },
    });

    // Delete image from Supabase Storage if it exists
    if (product.image) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          const { createClient } = await import("@supabase/supabase-js");
          const supabase = createClient(supabaseUrl, supabaseKey);

          // Extract file path from URL
          // URL format: https://[project].supabase.co/storage/v1/object/public/product-images/products/[filename]
          const urlMatch = product.image.match(/product-images\/(.+)$/);
          if (urlMatch && urlMatch[1]) {
            const filePath = urlMatch[1];
            
            const { error: storageError } = await supabase.storage
              .from("product-images")
              .remove([filePath]);

            if (storageError) {
              console.error("Error deleting image from storage:", storageError);
              // Don't fail the request if storage deletion fails
              // The database record is already deleted
            } else {
            }
          }
        }
      } catch (storageError) {
        console.error("Error deleting image from storage:", storageError);
        // Don't fail the request if storage deletion fails
        // The database record is already deleted
      }
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting product:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

