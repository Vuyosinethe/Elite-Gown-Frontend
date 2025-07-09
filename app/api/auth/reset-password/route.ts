import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { token, password, confirmPassword } = await request.json()

    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Try to verify custom token first
    try {
      const { data: tokenData, error: tokenError } = await supabase
        .from("password_reset_tokens")
        .select("user_id, expires_at, used")
        .eq("token", token)
        .single()

      if (!tokenError && tokenData) {
        // Check if token is expired
        if (new Date() > new Date(tokenData.expires_at)) {
          return NextResponse.json({ error: "Reset token has expired" }, { status: 400 })
        }

        // Check if token is already used
        if (tokenData.used) {
          return NextResponse.json({ error: "Reset token has already been used" }, { status: 400 })
        }

        // Update password using Supabase admin
        const { error: updateError } = await supabase.auth.admin.updateUserById(tokenData.user_id, {
          password: password,
        })

        if (updateError) {
          return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
        }

        // Mark token as used
        await supabase.from("password_reset_tokens").update({ used: true }).eq("token", token)

        return NextResponse.json({ message: "Password updated successfully" })
      }
    } catch (error) {
      console.log("Custom token verification failed, trying Supabase built-in reset")
    }

    // Fallback: This might be a Supabase-generated token
    // In this case, the reset should be handled by Supabase's built-in flow
    return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
