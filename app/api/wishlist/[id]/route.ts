import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

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
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const productId = params.id

    // Remove specific item from wishlist
    const { error } = await supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("product_id", productId)

    if (error) {
      console.error("Error removing from wishlist:", error)
      return NextResponse.json({ error: "Failed to remove item from wishlist" }, { status: 500 })
    }

    return NextResponse.json({ message: "Item removed from wishlist successfully" })
  } catch (error) {
    console.error("Wishlist item DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
