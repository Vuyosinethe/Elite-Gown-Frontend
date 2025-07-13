/* ---------------------------------------------------------------------------
   Supabase helper – safe in all environments (build, dev, prod)
   --------------------------------------------------------------------------- */

import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * We create the real client *lazily* the first time `createClient()` is called.
 * If the NEXT_PUBLIC_* vars are missing (for example in a CI build),
 * we fall back to a harmless placeholder so the build doesn’t crash.
 */
let cached: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  if (cached) return cached

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

  cached = createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  return cached
}

/* ---------------------------------------------------------------------------
   Types & convenient default export
   --------------------------------------------------------------------------- */

export type Profile = {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  role: string | null
  updated_at: string | null
}

/**
 * Default export so `import supabase from "@/lib/supabase"` works,
 * but note it instantiates the client immediately.
 */
const supabaseDefault = createClient()
export default supabaseDefault
