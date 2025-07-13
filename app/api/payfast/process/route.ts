import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getPayFastCheckoutForm } from "@/lib/payfast"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { cartItems, subtotal, vat, total } = await request.json()
    const headerList = headers()
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      headerList.get("x-forwarded-proto") + "://" + headerList.get("x-forwarded-host")

    if (!siteUrl) {
      return NextResponse.json({ error: "Site URL not configured." }, { status: 500 })
    }

    // Get user from auth header
    const authHeader = request.headers.get("authorization")
    let userId = null
    let userEmail = "guest@example.com" // Default for guest checkout
    let firstName = ""
    let lastName = ""

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const {
        data: { user },
      } = await supabase.auth.getUser(token)
      userId = user?.id
      userEmail = user?.email || userEmail

      // Fetch profile for first/last name
      if (userId) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", userId)
          .single()

        if (profileError) {
          console.error("Error fetching user profile:", profileError)
        } else if (profile) {
          firstName = profile.first_name || ""
          lastName = profile.last_name || ""
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated." }, { status: 401 })
    }

    // 1. Create a new order in the database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: total / 100, // Store in ZAR, not cents
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // 2. Add order items
    const orderItemsData = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_details: item.product_details,
      product_image: item.product_image,
      price: item.price, // Price in cents
      quantity: item.quantity,
    }))

    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItemsData)

    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError)
      // Optionally, roll back the order creation here
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // Update the order with a PayFast-specific order ID (m_payment_id)
    const payfastOrderId = `ELITEGOWNS-${order.id.substring(0, 8).toUpperCase()}-${Date.now()}`
    const { error: updateOrderError } = await supabase
      .from("orders")
      .update({ payfast_order_id: payfastOrderId })
      .eq("id", order.id)

    if (updateOrderError) {
      console.error("Error updating order with PayFast ID:", updateOrderError)
      return NextResponse.json({ error: "Failed to update order with PayFast ID" }, { status: 500 })
    }

    // 3. Generate PayFast form data
    const { url, fields } = getPayFastCheckoutForm(
      payfastOrderId,
      total, // Total in cents
      "Elite Gowns Purchase", // General item name for the whole cart
      userEmail,
      siteUrl,
      firstName,
      lastName,
    )

    // Return the PayFast URL and form fields to the client
    return NextResponse.json({ success: true, payfastUrl: url, payfastFields: fields })
  } catch (error) {
    console.error("Error in POST /api/payfast/process:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
