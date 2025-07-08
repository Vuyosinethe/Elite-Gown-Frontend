import { createClient } from "@supabase/supabase-js"

/**
 * Singleton Supabase browser-side client.
 * Uses the public credentials that Vercel injects at build time.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default supabase
