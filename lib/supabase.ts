import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ────────────────────────────────────────────────────────────────
//  NEW EXPORT
//  Export the factory so other modules can do:
//  import { createClient } from "@/lib/supabase"
// ────────────────────────────────────────────────────────────────
export { createClient }

// Create a mock client if environment variables are missing
const createMockClient = () => {
  console.warn("⚠️ Using mock Supabase client. Set up environment variables for real authentication.")

  // Return a mock client with the same interface but no real functionality
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signUp: async () => ({ data: {}, error: null }),
      signInWithPassword: async () => ({ data: {}, error: null }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      resetPasswordForEmail: async () => ({ error: null }),
      updateUser: async () => ({ error: null }),
      signInWithOAuth: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      insert: async () => ({ error: null }),
      update: async () => ({ error: null }),
    }),
  }
}

// Create the Supabase client, or a mock if environment variables are missing
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : createMockClient()
