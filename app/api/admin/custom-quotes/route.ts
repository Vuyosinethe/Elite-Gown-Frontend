import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if the user is an admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data: quotes, error } = await supabase
    .from("custom_quotes")
    .select("*, profiles(full_name, email)") // Fetch user details from profiles table
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching custom quotes:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(quotes)
}
