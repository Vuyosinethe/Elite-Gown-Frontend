import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

// Use service role key for admin operations
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Use anon key for regular operations
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists using regular supabase client
    const { data: existingUser, error: userCheckError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", email)
      .single()

    if (userCheckError || !existingUser) {
      return NextResponse.json({ error: "No account found with this email address." }, { status: 404 })
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Try to store token in database (handle table not existing)
    try {
      const { error: tokenError } = await supabase.from("password_reset_tokens").insert({
        user_id: existingUser.id,
        token,
        expires_at: expiresAt.toISOString(),
      })

      if (tokenError) {
        console.error("Error storing reset token:", tokenError)
        // If table doesn't exist, use Supabase's built-in reset
        return await sendSupabaseReset(email)
      }
    } catch (error) {
      console.error("Password reset table error:", error)
      // Fallback to Supabase's built-in reset
      return await sendSupabaseReset(email)
    }

    // Send custom reset email with our token
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`

    // For now, use Supabase's built-in reset since custom email might not be configured
    return await sendSupabaseReset(email)
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Fallback to Supabase's built-in password reset
async function sendSupabaseReset(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    if (error) {
      console.error("Supabase reset error:", error)
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
    }

    return NextResponse.json({ message: "Password reset email sent successfully" })
  } catch (error) {
    console.error("Supabase reset fallback error:", error)
    return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
  }
}
