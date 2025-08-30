import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Debug logging for environment variables
console.log("Supabase URL:", supabaseUrl ? "✓ Set" : "✗ Missing")
console.log("Supabase Anon Key:", supabaseAnonKey ? "✓ Set" : "✗ Missing")

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables:")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl || "MISSING")
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "SET" : "MISSING")
  throw new Error("Missing required Supabase environment variables. Please check your .env.local file.")
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  console.error("Invalid Supabase URL format:", supabaseUrl)
  throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL format. Please check your environment variables.")
}

// Check if using service role key instead of anon key (security issue)
try {
  const payload = JSON.parse(atob(supabaseAnonKey.split(".")[1]))
  if (payload.role === "service_role") {
    console.error("🚨 SECURITY WARNING: You're using the service_role key as the anon key!")
    console.error("This is a security risk. Please use the anon/public key instead.")
    throw new Error(
      "Invalid key: Using service_role key instead of anon key. Please check your Supabase dashboard for the correct anon/public key.",
    )
  }
} catch (error) {
  if (error.message.includes("service_role")) {
    throw error
  }
  // If we can't decode the JWT, continue (might be a valid key format we can't parse)
  console.warn("Could not validate key format, proceeding...")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export default supabase

export type Profile = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}
