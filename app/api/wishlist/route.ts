import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Retrieve user's wishlist items
export async function GET(request: NextRequest) {
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

    // Get wishlist items for the user
    const { data: wishlistItems, error } = await supabase
      .from("wishlist_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching wishlist:", error)
      return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
    }

    return NextResponse.json({ items: wishlistItems || [] })
  } catch (error) {
    console.error("Wishlist GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { id, name, category, price, image, description, rating, reviews, link } = body

    if (!id || !name || !category || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if item already exists in wishlist
    const { data: existingItem } = await supabase
      .from("wishlist_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", id)
      .single()

    if (existingItem) {
      return NextResponse.json({ error: "Item already in wishlist" }, { status: 409 })
    }

    // Add item to wishlist
    const { data, error } = await supabase
      .from("wishlist_items")
      .insert({
        user_id: user.id,
        product_id: id,
        name,
        category,
        price,
        image,
        description,
        rating,
        reviews,
        link,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding to wishlist:", error)
      return NextResponse.json({ error: "Failed to add item to wishlist" }, { status: 500 })
    }

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (error) {
    console.error("Wishlist POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Clear all wishlist items
export async function DELETE(request: NextRequest) {
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

    // Clear all wishlist items for the user
    const { error } = await supabase.from("wishlist_items").delete().eq("user_id", user.id)

    if (error) {
      console.error("Error clearing wishlist:", error)
      return NextResponse.json({ error: "Failed to clear wishlist" }, { status: 500 })
    }

    return NextResponse.json({ message: "Wishlist cleared successfully" })
  } catch (error) {
    console.error("Wishlist DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
