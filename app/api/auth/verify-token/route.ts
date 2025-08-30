import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Helper function to safely create Supabase client
function getSupabaseClient(useServiceRole = false) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials not available")
  }

  return createClient(supabaseUrl, supabaseKey)
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Get Supabase client
    let supabase
    try {
      supabase = getSupabaseClient(false)
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
    }

    // Try to verify token in our custom table
    try {
      const { data, error } = await supabase
        .from("password_reset_tokens")
        .select("user_id, used")
        .eq("token", token)
        .gt("expires_at", new Date().toISOString())
        .single()

      if (error) {
        // If table doesn't exist or token not found, assume it's a Supabase token
        return NextResponse.json({ valid: true, isSupabaseToken: true })
      }

      if (data.used) {
        return NextResponse.json({ valid: false, error: "Token has already been used" }, { status: 400 })
      }

      return NextResponse.json({ valid: true, isSupabaseToken: false })
    } catch (error) {
      console.error("Error verifying token:", error)
      // If custom table check fails, assume it's a Supabase token
      return NextResponse.json({ valid: true, isSupabaseToken: true })
    }
  } catch (error) {
    console.error("Verify token error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
