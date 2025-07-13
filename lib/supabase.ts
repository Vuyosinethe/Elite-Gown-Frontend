/* ---------------------------------------------------------------------------
   Supabase helper – safe in all environments (build, dev, prod)
   --------------------------------------------------------------------------- */

import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Profile } from "./types" // Assuming you have a types file for Profile

/**
 * We create the real client *lazily* the first time `getSupabaseClient()` is called.
 * If the NEXT_PUBLIC_* vars are missing (for example in a CI build),
 * we fall back to a harmless placeholder so the build doesn’t crash.
 */
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }

  /* Try real env vars first. */
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  /* Fallback – lets `next build` run even without real creds. */
  if (!url || !key) {
    console.warn(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY missing. " +
        "Using placeholder credentials for static generation.",
    )
    url = "http://localhost:54321"
    key = "public-anon-key"
  }

  supabaseInstance = createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseInstance
}

/* ---------------------------------------------------------------------------
   Types & convenient default export
   --------------------------------------------------------------------------- */

// Re-export createClient for server-side or specific needs
export { createSupabaseClient as createClient }

// Export the default client instance
const supabase = getSupabaseClient()
export default supabase

// Re-export Profile type for convenience
export type { Profile }
