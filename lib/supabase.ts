/* ------------------------------------------------------------------------
   Shared Supabase client
   ------------------------------------------------------------------------ */

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Environment variables (exposed on both server & client because they are
 * prefixed with NEXT_PUBLIC_).  Make sure they are set in your Vercel project.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase env vars are missing. " + "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
}

/** One singleton client for the entire Next.js runtime (per browser tab / server process). */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

/* ------------------------------------------------------------------------
   Exports
   ------------------------------------------------------------------------ */

/** Re-export the factory for code that needs a totally separate client (e.g. service-role). */
export { createClient }

/** Basic row shape for the `profiles` table (extend as needed). */
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

/** Default export so `import supabase from "@/lib/supabase"` also works. */
export default supabase
