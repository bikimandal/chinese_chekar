import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentStoreId, getDefaultStoreBySlug } from "@/lib/store";

// GET - Get current store status
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

    // Get store status for this store
    let status = await prisma.storeStatus.findUnique({
      where: { storeId },
    });

    if (!status) {
      // Create default status if none exists
      status = await prisma.storeStatus.create({
        data: {
          storeId,
          isOpen: true,
          message: "We are currently closed. Please check back later!",
        },
      });
    }

    return NextResponse.json(status);
  } catch (error: any) {
    console.error("Error fetching store status:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    });
    
    // If it's a model not found error, return helpful message
    if (error?.message?.includes('storeStatus') || error?.code === 'P2001') {
      return NextResponse.json(
        {
          error: "StoreStatus model not found. Please restart the server after running 'npx prisma generate'.",
          details: error?.message,
        },
        { status: 503 }
      );
    }
    
    // Return default status on other errors
    return NextResponse.json({
      id: "default",
      isOpen: true,
      message: "We are currently closed. Please check back later!",
      updatedAt: new Date().toISOString(),
    });
  }
}

// PUT - Update store status (admin only, default store only)
export async function PUT(request: Request) {
  try {
    const storeId = await getCurrentStoreId();
    if (!storeId) {
      return NextResponse.json(
        { error: "No store selected" },
        { status: 401 }
      );
    }

    // Only allow status updates for the default store
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { isDefault: true },
    });

    if (!store || !store.isDefault) {
      return NextResponse.json(
        { error: "Store status can only be updated for the default store" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { isOpen, message } = body;

    // Get the current status for this store
    const currentStatus = await prisma.storeStatus.findUnique({
      where: { storeId },
    });

    let status;
    if (currentStatus) {
      // Update existing status
      status = await prisma.storeStatus.update({
        where: { storeId },
        data: {
          isOpen: isOpen !== undefined ? isOpen : currentStatus.isOpen,
          message: message !== undefined ? message : currentStatus.message,
        },
      });
    } else {
      // Create new status if none exists
      status = await prisma.storeStatus.create({
        data: {
          storeId,
          isOpen: isOpen !== undefined ? isOpen : true,
          message: message || "We are currently closed. Please check back later!",
        },
      });
    }

    return NextResponse.json(status);
  } catch (error: any) {
    console.error("Error updating store status:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    });
    return NextResponse.json(
      { 
        error: "Failed to update store status",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

