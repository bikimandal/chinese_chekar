import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client
// Note: For server-side usage, pass the access token from cookies in the Authorization header
export function createSupabaseServerClient(accessToken?: string) {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (accessToken) {
    client.auth.setSession({
      access_token: accessToken,
      refresh_token: "",
    } as any);
  }

  return client;
}

// Client-side Supabase client
export function createSupabaseBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

