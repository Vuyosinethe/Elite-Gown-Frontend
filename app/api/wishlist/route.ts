import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use service role for server-side operations
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

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
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get wishlist items for the user
    const { data: wishlistItems, error } = await supabaseAdmin
      .from("wishlist_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching wishlist:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch wishlist",
          details: error.message,
        },
        { status: 500 },
      )
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
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { id, product_id, name, category, price, image, description, rating, reviews, link } = body

    // Use product_id if provided, otherwise use id
    const finalProductId = product_id || id?.toString() || Date.now().toString()

    if (!name || !category || price === undefined) {
      return NextResponse.json(
        {
          error: "Missing required fields: name, category, price",
        },
        { status: 400 },
      )
    }

    // Check if item already exists in wishlist
    const { data: existingItem } = await supabaseAdmin
      .from("wishlist_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", finalProductId)
      .single()

    if (existingItem) {
      return NextResponse.json({ error: "Item already in wishlist" }, { status: 409 })
    }

    // Add item to wishlist
    const { data, error } = await supabaseAdmin
      .from("wishlist_items")
      .insert({
        user_id: user.id,
        product_id: finalProductId,
        name: name,
        category: category,
        price: Number.parseInt(price.toString()),
        image: image || "/placeholder.svg",
        description: description || "",
        rating: rating ? Number.parseFloat(rating.toString()) : 0,
        reviews: reviews ? Number.parseInt(reviews.toString()) : 0,
        link: link || "#",
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding to wishlist:", error)
      return NextResponse.json(
        {
          error: "Failed to add item to wishlist",
          details: error.message,
        },
        { status: 500 },
      )
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
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Clear all wishlist items for the user
    const { error } = await supabaseAdmin.from("wishlist_items").delete().eq("user_id", user.id)

    if (error) {
      console.error("Error clearing wishlist:", error)
      return NextResponse.json(
        {
          error: "Failed to clear wishlist",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ message: "Wishlist cleared successfully" })
  } catch (error) {
    console.error("Wishlist DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
