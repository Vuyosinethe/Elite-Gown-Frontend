import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// PUT - Update cart item quantity
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const itemId = Number.parseInt(params.id)
    const body = await request.json()
    const { quantity } = body

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })
    }

    // Get user from auth header if available
    const authHeader = request.headers.get("authorization")
    let userId = null

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const {
        data: { user },
      } = await supabaseAdmin.auth.getUser(token)
      userId = user?.id
    }

    // Update the item quantity
    let updateQuery = supabaseAdmin.from("cart_items").update({ quantity }).eq("id", itemId)

    // Add user/session filter for security
    if (userId) {
      updateQuery = updateQuery.eq("user_id", userId)
    }

    const { data: updatedItem, error } = await updateQuery.select().single()

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
    const itemId = Number.parseInt(params.id)

    // Get user from auth header if available
    const authHeader = request.headers.get("authorization")
    let userId = null

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const {
        data: { user },
      } = await supabaseAdmin.auth.getUser(token)
      userId = user?.id
    }

    // Delete the specific item
    let deleteQuery = supabaseAdmin.from("cart_items").delete().eq("id", itemId)

    // Add user/session filter for security
    if (userId) {
      deleteQuery = deleteQuery.eq("user_id", userId)
    }

    const { error } = await deleteQuery

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
