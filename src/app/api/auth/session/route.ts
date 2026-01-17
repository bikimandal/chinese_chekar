import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/user-access";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ 
        user: null, 
        session: null,
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      // Try to refresh the token
      const { data: refreshData, error: refreshError } =
        await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });

      if (refreshError || !refreshData.session) {
        // Both access and refresh failed, clear tokens
        const errorResponse = NextResponse.json({ user: null, session: null });
        errorResponse.cookies.delete("sb-access-token");
        errorResponse.cookies.delete("sb-refresh-token");
        return errorResponse;
      }

      // Create response with refreshed session
      const response = NextResponse.json({
        user: refreshData.user,
        session: {
          access_token: refreshData.session.access_token,
          expires_at: refreshData.session.expires_at,
        },
      });

      // Update cookies with new tokens using NextResponse
      response.cookies.set("sb-access-token", refreshData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      response.cookies.set("sb-refresh-token", refreshData.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      return response;
    }

    // Get user from database with role and store access
    const dbUser = await getCurrentUser();
    
    return NextResponse.json({ 
      user, 
      session: { access_token: accessToken },
      dbUser: dbUser ? {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        storeAccess: dbUser.storeAccess.map(sa => sa.storeId),
      } : null,
    });
  } catch (error: any) {
    console.error("Session check error:", error);
    return NextResponse.json({ user: null, session: null, dbUser: null });
  }
}

