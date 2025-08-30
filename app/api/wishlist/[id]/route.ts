import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use service role for server-side operations
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// DELETE - Remove specific item from wishlist
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Verify the user token
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const itemId = params.id

    // Remove specific item from wishlist (can be by product_id or by id)
    const { error } = await supabaseAdmin
      .from("wishlist_items")
      .delete()
      .eq("user_id", user.id)
      .or(`product_id.eq.${itemId},id.eq.${itemId}`)

    if (error) {
      console.error("Error removing from wishlist:", error)
      return NextResponse.json(
        {
          error: "Failed to remove item from wishlist",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ message: "Item removed from wishlist successfully" })
  } catch (error) {
    console.error("Wishlist item DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
