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

    // Verify admin role (this is a basic check, more robust checks might be needed)
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

    // Fetch all users and their profiles
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()

    if (usersError) {
      console.error("Error listing users:", usersError)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    const userIds = users.users.map((u) => u.id)
    const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").in("id", userIds)

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
      return NextResponse.json({ error: "Failed to fetch user profiles" }, { status: 500 })
    }

    // Combine user auth data with profile data
    const combinedUsers = users.users.map((userAuth) => {
      const userProfile = profiles.find((p) => p.id === userAuth.id)
      return {
        id: userAuth.id,
        email: userAuth.email,
        created_at: userAuth.created_at,
        last_sign_in_at: userAuth.last_sign_in_at,
        email_confirmed_at: userAuth.email_confirmed_at,
        role: userProfile?.role || "user", // Default to 'user' if role not found
        first_name: userProfile?.first_name || null,
        last_name: userProfile?.last_name || null,
        phone: userProfile?.phone || null,
        avatar_url: userProfile?.avatar_url || null,
        profile_created_at: userProfile?.created_at || null,
        profile_updated_at: userProfile?.updated_at || null,
      }
    })

    return NextResponse.json(combinedUsers)
  } catch (error) {
    console.error("Admin users API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
