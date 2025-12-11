import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error("NEXT_PUBLIC_SUPABASE_URL is not set");
      return NextResponse.json(
        { error: "Server configuration error: Supabase URL not configured" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error: Supabase key not configured" },
        { status: 500 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase auth error:", error);
      return NextResponse.json(
        { error: error.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!data.session) {
      console.error("No session returned from Supabase");
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 401 }
      );
    }

    // Create response with user data
    const response = NextResponse.json({
      user: data.user,
      session: {
        access_token: data.session.access_token,
        expires_at: data.session.expires_at,
      },
    });

    // Set session cookies using NextResponse
    // In development, don't use secure flag (localhost doesn't support secure cookies)
    const isProduction = process.env.NODE_ENV === "production";
    
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    };

    const accessTokenValue = data.session.access_token;
    const refreshTokenValue = data.session.refresh_token;

    // Set cookies
    response.cookies.set("sb-access-token", accessTokenValue, cookieOptions);
    response.cookies.set("sb-refresh-token", refreshTokenValue, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });


    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

