import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, role, created_at")

  if (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(users)
}
