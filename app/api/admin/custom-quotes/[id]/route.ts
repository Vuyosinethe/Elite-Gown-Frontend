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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
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

    const { data: quote, error } = await supabase.from("custom_quotes").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching custom quote ${id}:`, error)
      return NextResponse.json({ error: "Custom quote not found" }, { status: 404 })
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error("Admin custom quote GET API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updates = await request.json()
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

    const { data, error } = await supabase.from("custom_quotes").update(updates).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating custom quote ${id}:`, error)
      return NextResponse.json({ error: "Failed to update custom quote" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Admin custom quote PUT API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
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

    const { error } = await supabase.from("custom_quotes").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting custom quote ${id}:`, error)
      return NextResponse.json({ error: "Failed to delete custom quote" }, { status: 500 })
    }

    return NextResponse.json({ message: "Custom quote deleted successfully" })
  } catch (error) {
    console.error("Admin custom quote DELETE API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
