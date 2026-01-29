import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, hasStoreAccess } from "@/lib/user-access";

// GET - Get single store (must have access)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if user has access to this store
    if (!(await hasStoreAccess(id))) {
      return NextResponse.json(
        { error: "Unauthorized - No access to this store" },
        { status: 403 }
      );
    }

    const store = await prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(store);
  } catch (error: any) {
    console.error("Error fetching store:", error);
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    );
  }
}

// PUT - Update store
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, isDefault, invoiceName, invoiceAddress, invoicePhone } = body;

    // Check if user has access to this store
    if (!(await hasStoreAccess(id))) {
      return NextResponse.json(
        { error: "Unauthorized - No access to this store" },
        { status: 403 }
      );
    }

    // Only admins can update name, slug, and isDefault
    const isUserAdmin = await isAdmin();
    const updateData: any = {};

    if (name !== undefined || slug !== undefined || isDefault !== undefined) {
      if (!isUserAdmin) {
        return NextResponse.json(
          { error: "Unauthorized - Admin access required for this operation" },
          { status: 403 }
        );
      }

      if (name !== undefined && (!name || !name.trim())) {
        return NextResponse.json(
          { error: "Store name is required" },
          { status: 400 }
        );
      }

      if (slug !== undefined) {
        if (!slug || !slug.trim()) {
          return NextResponse.json(
            { error: "Store slug is required" },
            { status: 400 }
          );
        }

        // Validate slug format
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
          return NextResponse.json(
            { error: "Slug must be lowercase alphanumeric with hyphens only" },
            { status: 400 }
          );
        }
        updateData.slug = slug.trim().toLowerCase();
      }

      if (name !== undefined) {
        updateData.name = name.trim();
      }

      // If setting as default, unset other defaults
      if (isDefault) {
        await prisma.store.updateMany({
          where: { isDefault: true, id: { not: id } },
          data: { isDefault: false },
        });
        updateData.isDefault = true;
      } else if (isDefault === false) {
        updateData.isDefault = false;
      }
    }

    // Any user with store access can update invoice fields
    if (invoiceName !== undefined) {
      updateData.invoiceName = invoiceName?.trim() || null;
    }
    if (invoiceAddress !== undefined) {
      updateData.invoiceAddress = invoiceAddress?.trim() || null;
    }
    if (invoicePhone !== undefined) {
      updateData.invoicePhone = invoicePhone?.trim() || null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const store = await prisma.store.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(store);
  } catch (error: any) {
    console.error("Error updating store:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A store with this name or slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 }
    );
  }
}

// DELETE - Delete store (admin only, with caution - this will delete all associated data)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }
    const { id } = await params;

    // Check if this is the default store
    const store = await prisma.store.findUnique({
      where: { id },
      select: { isDefault: true },
    });

    if (store?.isDefault) {
      return NextResponse.json(
        { error: "Cannot delete the default store" },
        { status: 400 }
      );
    }

    // Delete store (cascade will delete all associated data)
    await prisma.store.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Store deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting store:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete store" },
      { status: 500 }
    );
  }
}
