import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { status, quoted_price, quoted_currency } = await request.json()

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const updates: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (quoted_price !== undefined) {
    updates.quoted_price = quoted_price
    updates.quoted_currency = quoted_currency || "USD"
    updates.quoted_by = user.id // Set the admin who quoted it
    updates.quoted_at = new Date().toISOString()
  }

  const { data, error } = await supabase.from("custom_quotes").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating custom quote ${id}:`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
