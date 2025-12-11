import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get current store status
export async function GET() {
  try {
    // Get the most recent store status, or create default if none exists
    let status = await prisma.storeStatus.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!status) {
      // Create default status if none exists
      status = await prisma.storeStatus.create({
        data: {
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

// PUT - Update store status
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { isOpen, message } = body;

    // Get the most recent status
    const currentStatus = await prisma.storeStatus.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    let status;
    if (currentStatus) {
      // Update existing status
      status = await prisma.storeStatus.update({
        where: { id: currentStatus.id },
        data: {
          isOpen: isOpen !== undefined ? isOpen : currentStatus.isOpen,
          message: message !== undefined ? message : currentStatus.message,
        },
      });
    } else {
      // Create new status if none exists
      status = await prisma.storeStatus.create({
        data: {
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

