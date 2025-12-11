"use client";

import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client
// Note: Authentication is handled via API routes with HTTP-only cookies
// This client is for non-auth operations only
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false, // Disable localStorage - we use cookies via API routes
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storage: {
        // Custom storage that does nothing - prevents localStorage usage
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
    },
  }
);

