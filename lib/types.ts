// lib/types.ts
export interface Profile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  role?: "user" | "admin" // Add role to profile type
  created_at?: string
  updated_at?: string
}
