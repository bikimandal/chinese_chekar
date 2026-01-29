import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdmin, UserRole } from "@/lib/user-access";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// GET - Get all users (admin only)
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Remove password from response
    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    return NextResponse.json(usersWithoutPassword);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Create new user (admin only)
export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, password, name, role, storeIds } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = [UserRole.ADMIN, UserRole.USER];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Supabase Auth
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: supabaseUser, error: supabaseError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (supabaseError || !supabaseUser.user) {
      console.error("Supabase user creation error:", supabaseError);
      return NextResponse.json(
        { error: supabaseError?.message || "Failed to create user" },
        { status: 500 }
      );
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword, // Store hashed password as backup
        name: name?.trim() || null,
        role: role || UserRole.USER,
        storeAccess: storeIds && Array.isArray(storeIds) && storeIds.length > 0
          ? {
              create: storeIds.map((storeId: string) => ({
                storeId,
              })),
            }
          : undefined,
      },
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

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
