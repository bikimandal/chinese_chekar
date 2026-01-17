import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentStoreId, getDefaultStoreBySlug } from "@/lib/store";

// GET - Get single item
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const item = await prisma.item.findUnique({
      where: { id, storeId },
      include: {
        category: true,
        product: true,
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

// PUT - Update item (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const storeId = await getCurrentStoreId();
    if (!storeId) {
      return NextResponse.json(
        { error: "No store selected" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, price, stock, image, categoryId, productId, isAvailable, isVisible } = body;

    // Verify item belongs to current store
    const existingItem = await prisma.item.findUnique({
      where: { id },
      select: { storeId: true },
    });

    if (!existingItem || existingItem.storeId !== storeId) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    const item = await prisma.item.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(image !== undefined && { image }),
        ...(categoryId && { categoryId }),
        ...(productId && { productId }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(isVisible !== undefined && { isVisible }),
      },
      include: {
        category: true,
        product: true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE - Delete item (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const storeId = await getCurrentStoreId();
    if (!storeId) {
      return NextResponse.json(
        { error: "No store selected" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Get item to find image path before deleting, and verify store ownership
    const item = await prisma.item.findUnique({
      where: { id, storeId },
      include: {
        product: {
          select: { image: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    // Delete from database first
    await prisma.item.delete({
      where: { id },
    });

    // Delete image from Supabase Storage if it exists and is not shared with product
    // Only delete if item has its own image that's different from product image
    if (item.image) {
      // Check if this is the item's own image (not shared from product)
      const isOwnImage = !item.productId || item.image !== item.product?.image;
      
      if (isOwnImage) {
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

          if (supabaseUrl && supabaseKey) {
            const { createClient } = await import("@supabase/supabase-js");
            const supabase = createClient(supabaseUrl, supabaseKey);

            // Extract file path from URL
            // URL format: https://[project].supabase.co/storage/v1/object/public/product-images/products/[filename]
            const urlMatch = item.image.match(/product-images\/(.+)$/);
            if (urlMatch && urlMatch[1]) {
              const filePath = urlMatch[1];
              
              const { error: storageError } = await supabase.storage
                .from("product-images")
                .remove([filePath]);

              if (storageError) {
                console.error("Error deleting image from storage:", storageError);
                // Don't fail the request if storage deletion fails
                // The database record is already deleted
              }
            }
          }
        } catch (storageError) {
          console.error("Error deleting image from storage:", storageError);
          // Don't fail the request if storage deletion fails
          // The database record is already deleted
        }
      }
    }

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting item:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete item", message: error.message },
      { status: 500 }
    );
  }
}

