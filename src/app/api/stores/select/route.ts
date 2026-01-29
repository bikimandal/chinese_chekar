import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { validateStoreAccess } from "@/lib/store";

// POST - Select a store (set in session)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storeId } = body;

    if (!storeId) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    // Validate store exists and is active
    const hasAccess = await validateStoreAccess(storeId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Store not found or inactive" },
        { status: 404 }
      );
    }

    // Set store ID in cookie
    const cookieStore = await cookies();
    cookieStore.set("current-store-id", storeId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true, storeId });
  } catch (error: any) {
    console.error("Error selecting store:", error);
    return NextResponse.json(
      { error: "Failed to select store" },
      { status: 500 }
    );
  }
}
