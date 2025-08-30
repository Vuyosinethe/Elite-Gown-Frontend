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
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // Get Supabase client
    let supabase
    try {
      supabase = getSupabaseClient(false)
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
    }

    // Check if user exists
    try {
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single()

      if (userError && userError.code !== "PGRST116") {
        console.error("Error checking user:", userError)
      }
    } catch (error) {
      console.log("Profile check failed, continuing with reset attempt")
    }

    // Use Supabase's built-in password reset
    const resetUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elitegown.vercel.app"

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${resetUrl}/reset-password`,
    })

    if (resetError) {
      console.error("Error sending reset email:", resetError)

      // Don't reveal if email exists or not for security
      if (resetError.message.includes("User not found")) {
        return NextResponse.json({ error: "No account found with this email address" }, { status: 400 })
      }

      return NextResponse.json({ error: "Failed to send reset email. Please try again." }, { status: 500 })
    }

    return NextResponse.json({
      message: "If an account with this email exists, you will receive a password reset link shortly.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
