import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Decrement stock by 1
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get current item
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Decrement stock, but don't go below 0
    const newStock = Math.max(0, item.stock - 1);

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        stock: newStock,
      },
      include: {
        category: true,
        product: true,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error decrementing stock:", error);
    return NextResponse.json(
      { error: "Failed to decrement stock" },
      { status: 500 }
    );
  }
}

