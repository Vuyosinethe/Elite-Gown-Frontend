import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Try to verify custom token
    try {
      const { data: tokenData, error: tokenError } = await supabase
        .from("password_reset_tokens")
        .select("user_id, expires_at, used")
        .eq("token", token)
        .single()

      if (tokenError || !tokenData) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 })
      }

      // Check if token is expired
      if (new Date() > new Date(tokenData.expires_at)) {
        return NextResponse.json({ error: "Token has expired" }, { status: 400 })
      }

      // Check if token is already used
      if (tokenData.used) {
        return NextResponse.json({ error: "Token has already been used" }, { status: 400 })
      }

      return NextResponse.json({ valid: true })
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
