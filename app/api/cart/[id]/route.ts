import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// PUT - Update cart item quantity
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { quantity } = await request.json()
    const itemId = params.id

    if (quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 })
    }

    // Get user from auth header if available
    const authHeader = request.headers.get("authorization")
    let userId = null

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const {
        data: { user },
      } = await supabase.auth.getUser(token)
      userId = user?.id
    }

    // Update the item quantity
    let updateQuery = supabase.from("cart_items").update({ quantity }).eq("id", itemId)

    if (userId) {
      updateQuery = updateQuery.eq("user_id", userId)
    }

    const { data: updatedItem, error } = await updateQuery.select().single()

    if (error?.code === "42P01") {
      return NextResponse.json(
        { error: "Cart table not found. Please run scripts/create-cart-table.sql." },
        { status: 500 },
      )
    }

    if (error) {
      console.error("Error updating cart item:", error)
      return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
    }

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error("Error in PUT /api/cart/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Remove specific cart item
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const itemId = params.id

    // Get user from auth header if available
    const authHeader = request.headers.get("authorization")
    let userId = null

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const {
        data: { user },
      } = await supabase.auth.getUser(token)
      userId = user?.id
    }

    // Delete the specific item
    let deleteQuery = supabase.from("cart_items").delete().eq("id", itemId)

    if (userId) {
      deleteQuery = deleteQuery.eq("user_id", userId)
    }

    const { error } = await deleteQuery

    if (error?.code === "42P01") {
      return NextResponse.json(
        { error: "Cart table not found. Please run scripts/create-cart-table.sql." },
        { status: 500 },
      )
    }

    if (error) {
      console.error("Error removing cart item:", error)
      return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/cart/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
