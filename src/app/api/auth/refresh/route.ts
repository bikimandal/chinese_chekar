import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token found" },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Refresh the session using the refresh token
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      // Clear invalid tokens
      cookieStore.delete("sb-access-token");
      cookieStore.delete("sb-refresh-token");
      return NextResponse.json(
        { error: "Failed to refresh session" },
        { status: 401 }
      );
    }

    // Create response
    const response = NextResponse.json({
      user: data.user,
      session: {
        access_token: data.session.access_token,
        expires_at: data.session.expires_at,
      },
    });

    // Update cookies with new tokens using NextResponse
    response.cookies.set("sb-access-token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    response.cookies.set("sb-refresh-token", data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

