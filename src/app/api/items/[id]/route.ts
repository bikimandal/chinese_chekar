import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get single item
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.item.findUnique({
      where: { id },
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
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, stock, image, categoryId, productId, isAvailable, isVisible } = body;

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
    const { id } = await params;
    
    await prisma.item.delete({
      where: { id },
    });

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

