import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Helper function to safely create Supabase client with service role
function getSupabaseServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase service role credentials not available")
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceRoleClient()

    // Verify admin role
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Not an admin" }, { status: 403 })
    }

    const { data: quotes, error } = await supabase
      .from("custom_quotes")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching custom quotes:", error)
      return NextResponse.json({ error: "Failed to fetch custom quotes" }, { status: 500 })
    }

    return NextResponse.json(quotes)
  } catch (error) {
    console.error("Admin custom quotes API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
