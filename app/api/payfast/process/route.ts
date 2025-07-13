import { type NextRequest, NextResponse } from "next/server"
import { getPayFastFormFields } from "@/lib/payfast"
import { supabase } from "@/lib/supabase"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { cartItems, userId, totalAmount } = await request.json()

    if (!userId || !cartItems || cartItems.length === 0 || totalAmount === undefined) {
      return NextResponse.json({ error: "Missing required fields for checkout" }, { status: 400 })
    }

    // 1. Create a new order in the database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: "pending", // Initial status
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // 2. Add order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id, // Assuming product_id exists
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItems)

    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError)
      // Optionally, roll back the order creation here
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // 3. Get user email for PayFast
    const { data: user, error: userError } = await supabase.from("profiles").select("email").eq("id", userId).single()

    if (userError || !user?.email) {
      console.error("Error fetching user email:", userError)
      return NextResponse.json({ error: "Failed to retrieve user email" }, { status: 500 })
    }

    // Determine the base URL for return/cancel/notify
    const host = headers().get("host")
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`

    const returnUrl = `${baseUrl}/payfast/return?order_id=${order.id}`
    const cancelUrl = `${baseUrl}/payfast/cancel?order_id=${order.id}`
    const notifyUrl = `${baseUrl}/api/payfast/notify` // PayFast will POST to this endpoint

    // 4. Generate PayFast form fields
    const payFastFields = getPayFastFormFields({
      orderId: order.id,
      amount: totalAmount,
      itemName: `Elite Gowns Order #${order.id.substring(0, 8)}`, // A descriptive name
      userEmail: user.email,
      returnUrl,
      cancelUrl,
      notifyUrl,
    })

    // 5. Update the order with the PayFast ID (our order ID is the m_payment_id)
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payfast_order_id: order.id }) // m_payment_id is our order.id
      .eq("id", order.id)

    if (updateError) {
      console.error("Failed to update order with PayFast ID:", updateError)
      return NextResponse.json({ error: "Failed to update order with PayFast ID" }, { status: 500 })
    }

    // Return the PayFast form fields to the client
    return NextResponse.json({ success: true, payFastFields })
  } catch (error) {
    console.error("Checkout process error:", error)
    return NextResponse.json({ error: "Internal server error during checkout" }, { status: 500 })
  }
}
