import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { status, quoted_price } = await request.json()

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if the user is an admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Not an admin" }, { status: 403 })
  }

  const updates: { status: string; quoted_price?: number; updated_at: string } = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (quoted_price !== undefined) {
    updates.quoted_price = quoted_price
  }

  const { data, error } = await supabase.from("custom_quotes").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating custom quote:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
