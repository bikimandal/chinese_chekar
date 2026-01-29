import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentStoreId } from "@/lib/store";

// POST - Copy products to another store
export async function POST(request: Request) {
  try {
    const sourceStoreId = await getCurrentStoreId();
    if (!sourceStoreId) {
      return NextResponse.json(
        { error: "No store selected" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productIds, targetStoreId } = body;

    if (!targetStoreId) {
      return NextResponse.json(
        { error: "Target store is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "At least one product must be selected" },
        { status: 400 }
      );
    }

    // Verify target store exists
    const targetStore = await prisma.store.findUnique({
      where: { id: targetStoreId },
    });

    if (!targetStore) {
      return NextResponse.json(
        { error: "Target store not found" },
        { status: 404 }
      );
    }

    // Verify source store exists
    const sourceStore = await prisma.store.findUnique({
      where: { id: sourceStoreId },
    });

    if (!sourceStore) {
      return NextResponse.json(
        { error: "Source store not found" },
        { status: 404 }
      );
    }

    // Fetch products from source store
    const productsToCopy = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        storeId: sourceStoreId,
      },
    });

    if (productsToCopy.length === 0) {
      return NextResponse.json(
        { error: "No valid products found to copy" },
        { status: 404 }
      );
    }

    // Get existing product names in target store for duplicate checking
    const existingProducts = await prisma.product.findMany({
      where: { storeId: targetStoreId },
      select: { name: true },
    });

    const existingNames = new Set(existingProducts.map((p) => p.name.toLowerCase()));

    // Copy products efficiently using createMany with skipDuplicates
    // But we need to handle duplicates manually since we want to skip them
    const productsToCreate = productsToCopy
      .filter((product) => !existingNames.has(product.name.toLowerCase()))
      .map((product) => ({
        name: product.name,
        description: product.description,
        image: product.image,
        hasHalfFullPlate: product.hasHalfFullPlate,
        halfPlatePrice: product.halfPlatePrice,
        fullPlatePrice: product.fullPlatePrice,
        storeId: targetStoreId,
      }));

    let copiedCount = 0;
    let skippedCount = 0;

    if (productsToCreate.length > 0) {
      // Use createMany for efficiency, but handle potential duplicates
      try {
        await prisma.product.createMany({
          data: productsToCreate,
          skipDuplicates: true,
        });
        copiedCount = productsToCreate.length;
      } catch (error: any) {
        // If createMany fails, try individual creates to get exact count
        for (const productData of productsToCreate) {
          try {
            await prisma.product.create({
              data: productData,
            });
            copiedCount++;
          } catch (err: any) {
            // Skip duplicates (P2002 is unique constraint violation)
            if (err.code === "P2002") {
              skippedCount++;
            } else {
              throw err;
            }
          }
        }
      }
    }

    skippedCount += productsToCopy.length - productsToCreate.length;

    return NextResponse.json({
      success: true,
      copied: copiedCount,
      skipped: skippedCount,
      total: productsToCopy.length,
      message: `Successfully copied ${copiedCount} product(s). ${skippedCount} duplicate(s) skipped.`,
    });
  } catch (error: any) {
    console.error("Error copying products:", error);
    return NextResponse.json(
      {
        error: "Failed to copy products",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
