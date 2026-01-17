import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdmin, UserRole } from "@/lib/user-access";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// GET - Get single user (admin only)
export async function GET(
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
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        storeAccess: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT - Update user (admin only)
export async function PUT(
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
    const body = await request.json();
    const { email, password, name, role, storeIds } = body;

    // Get existing user
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Validate role if provided
    if (role) {
      const validRoles = [UserRole.ADMIN, UserRole.USER];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: "Invalid role" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (email) updateData.email = email.trim().toLowerCase();
    if (name !== undefined) updateData.name = name?.trim() || null;
    if (role) updateData.role = role;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        storeAccess: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    // Update store access if provided
    if (storeIds && Array.isArray(storeIds)) {
      // Delete existing store access
      await prisma.userStore.deleteMany({
        where: { userId: id },
      });

      // Create new store access
      if (storeIds.length > 0) {
        await prisma.userStore.createMany({
          data: storeIds.map((storeId: string) => ({
            userId: id,
            storeId,
          })),
        });
      }

      // Fetch updated user with store access
      const updatedUser = await prisma.user.findUnique({
        where: { id },
        include: {
          storeAccess: {
            include: {
              store: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      if (updatedUser) {
        const { password: _, ...userWithoutPassword } = updatedUser;
        return NextResponse.json(userWithoutPassword);
      }
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (admin only)
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

    const currentUser = await getCurrentUser();
    const { id } = await params;

    // Prevent deleting yourself
    if (currentUser?.id === id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Fetch user email BEFORE deleting from Prisma
    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete from Supabase Auth first
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const authUser = authUsers?.users.find((u) => u.email === user.email);
      if (authUser) {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(authUser.id);
        if (deleteError) {
          console.error("Error deleting user from Supabase Auth:", deleteError);
          // Continue with Prisma deletion even if Supabase deletion fails
        }
      }
    } catch (authError) {
      console.error("Error deleting user from Supabase Auth:", authError);
      // Continue with Prisma deletion even if Supabase deletion fails
    }

    // Delete user from Prisma (cascade will delete UserStore relationships)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
