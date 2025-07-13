// lib/types.ts
export type Profile = {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  role: string | null
  created_at?: string
  updated_at: string | null
}

// Add other types as needed for your application
