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

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
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
      const { data: tokenData, error: tokenError } = await supabase
        .from("password_reset_tokens")
        .select("user_id, used")
        .eq("token", token)
        .gt("expires_at", new Date().toISOString())
        .single()

      if (!tokenError && tokenData && !tokenData.used) {
        // Token is valid in our system, update password
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
        })

        if (updateError) {
          console.error("Error updating password:", updateError)
          return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
        }

        // Mark token as used
        await supabase.from("password_reset_tokens").update({ used: true }).eq("token", token)

        return NextResponse.json({ message: "Password updated successfully" })
      }
    } catch (error) {
      console.error("Error verifying custom token:", error)
      // Continue to try Supabase's built-in reset
    }

    // If custom token verification failed, try Supabase's built-in reset
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        console.error("Error updating password with Supabase:", updateError)
        return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
      }

      return NextResponse.json({ message: "Password updated successfully" })
    } catch (error) {
      console.error("Error in Supabase password update:", error)
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
