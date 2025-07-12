import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { status } = await request.json()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
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

  // Validate status
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status provided" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() }) // Manually update timestamp
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
