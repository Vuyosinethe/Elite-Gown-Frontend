import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { status, estimated_price, final_price, admin_notes } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

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
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const updateData: {
    status?: string
    estimated_price?: number
    final_price?: number
    admin_notes?: string
    updated_at: string
  } = { updated_at: new Date().toISOString() }

  if (status) updateData.status = status
  if (estimated_price !== undefined) updateData.estimated_price = estimated_price
  if (final_price !== undefined) updateData.final_price = final_price
  if (admin_notes !== undefined) updateData.admin_notes = admin_notes

  const { data, error } = await supabase.from("custom_quotes").update(updateData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating custom quote:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
