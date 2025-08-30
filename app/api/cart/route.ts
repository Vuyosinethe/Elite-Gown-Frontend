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

// GET - Fetch cart items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

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

    let query = supabaseAdmin.from("cart_items").select("*").order("created_at", { ascending: true })

    if (userId) {
      query = query.eq("user_id", userId)
    } else if (sessionId) {
      query = query.eq("session_id", sessionId)
    } else {
      return NextResponse.json({ items: [] })
    }

    const { data: items, error } = await query

    if (error?.code === "42P01") {
      // cart_items table missing – return empty result instead of throwing
      return NextResponse.json({ items: [] })
    }

    if (error) {
      console.error("Error fetching cart items:", error)
      return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 })
    }

    return NextResponse.json({ items: items || [] })
  } catch (error) {
    console.error("Error in GET /api/cart:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, productName, productDetails, productImage, price, quantity = 1, sessionId } = body

    console.log("Add to cart request:", {
      productId,
      productName,
      productDetails,
      productImage,
      price,
      quantity,
      sessionId,
    })

    // Get user from auth header if available
    const authHeader = request.headers.get("authorization")
    let userId = null

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const {
        data: { user },
        error: userError,
      } = await supabaseAdmin.auth.getUser(token)

      if (userError) {
        console.log("Auth error (continuing as guest):", userError)
      } else {
        userId = user?.id
      }
    }

    if (!userId && !sessionId) {
      return NextResponse.json({ error: "User ID or session ID required" }, { status: 400 })
    }

    // Check if cart_items table exists by trying to query it
    const { error: tableCheckError } = await supabaseAdmin.from("cart_items").select("id").limit(1)

    if (tableCheckError?.code === "42P01") {
      return NextResponse.json(
        { error: "Cart table not found. Please run the database setup scripts." },
        { status: 500 },
      )
    }

    // Check if item already exists in cart using service role client
    let existingQuery = supabaseAdmin.from("cart_items").select("*").eq("product_id", productId)

    if (userId) {
      existingQuery = existingQuery.eq("user_id", userId)
    } else {
      existingQuery = existingQuery.eq("session_id", sessionId).is("user_id", null)
    }

    console.log("Checking for existing items with query:", {
      productId,
      userId,
      sessionId,
    })

    const { data: existingItems, error: existingError } = await existingQuery

    if (existingError) {
      console.error("Error checking existing items:", existingError)
      return NextResponse.json({ error: "Failed to check existing cart items" }, { status: 500 })
    }

    console.log("Existing items found:", existingItems)

    if (existingItems && existingItems.length > 0) {
      // Update existing item quantity
      const existingItem = existingItems[0]
      const newQuantity = existingItem.quantity + quantity

      const { data: updatedItem, error: updateError } = await supabaseAdmin
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id)
        .select()
        .single()

      if (updateError) {
        console.error("Error updating cart item:", updateError)
        return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
      }

      return NextResponse.json({ item: updatedItem, message: "Item quantity updated" })
    } else {
      // Add new item to cart
      const newItem = {
        product_id: productId,
        product_name: productName,
        product_details: productDetails || "",
        product_image: productImage || "/placeholder.svg?height=80&width=80",
        price: Number(price),
        quantity: Number(quantity),
        ...(userId ? { user_id: userId } : { session_id: sessionId }),
      }

      console.log("Creating new cart item:", newItem)

      const { data: createdItem, error: createError } = await supabaseAdmin
        .from("cart_items")
        .insert(newItem)
        .select()
        .single()

      if (createError) {
        console.error("Error creating cart item:", createError)
        return NextResponse.json({ error: `Failed to add item to cart: ${createError.message}` }, { status: 500 })
      }

      return NextResponse.json({ item: createdItem, message: "Item added to cart" })
    }
  } catch (error) {
    console.error("Error in POST /api/cart:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

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

    let deleteQuery = supabaseAdmin.from("cart_items").delete()

    if (userId) {
      deleteQuery = deleteQuery.eq("user_id", userId)
    } else if (sessionId) {
      deleteQuery = deleteQuery.eq("session_id", sessionId)
    } else {
      return NextResponse.json({ error: "User ID or session ID required" }, { status: 400 })
    }

    const { error } = await deleteQuery

    if (error) {
      console.error("Error clearing cart:", error)
      return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/cart:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
