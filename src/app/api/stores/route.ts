import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllStores } from "@/lib/store";
import { isAdmin } from "@/lib/user-access";

// GET - Get all active stores (admin only, or use /api/stores/accessible for filtered list)
export async function GET() {
  try {
    // Only admin can see all stores
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const stores = await getAllStores();
    return NextResponse.json(stores);
  } catch (error: any) {
    console.error("Error fetching stores:", error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}

// POST - Create new store (admin only)
export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }
    const body = await request.json();
    const { name, slug, isDefault } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Store name is required" },
        { status: 400 }
      );
    }

    if (!slug || !slug.trim()) {
      return NextResponse.json(
        { error: "Store slug is required" },
        { status: 400 }
      );
    }

    // Validate slug format (lowercase, alphanumeric, hyphens only)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: "Slug must be lowercase alphanumeric with hyphens only" },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.store.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const store = await prisma.store.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        isDefault: isDefault ?? false,
        isActive: true,
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error: any) {
    console.error("Error creating store:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A store with this name or slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    );
  }
}
