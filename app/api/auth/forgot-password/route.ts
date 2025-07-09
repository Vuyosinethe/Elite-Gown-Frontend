import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

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
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Get Supabase client with anon key
    let supabase
    try {
      supabase = getSupabaseClient(false)
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
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
        return await sendSupabaseReset(email, supabase)
      }
    } catch (error) {
      console.error("Password reset table error:", error)
      // Fallback to Supabase's built-in reset
      return await sendSupabaseReset(email, supabase)
    }

    // Send custom reset email with our token
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`

    // For now, use Supabase's built-in reset since custom email might not be configured
    return await sendSupabaseReset(email, supabase)
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Fallback to Supabase's built-in password reset
async function sendSupabaseReset(email: string, supabase: any) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
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
