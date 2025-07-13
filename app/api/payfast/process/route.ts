import { type NextRequest, NextResponse } from "next/server"
import { getPayFastCheckoutForm } from "@/lib/payfast"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { cartItems, userId } = await request.json()

    if (!userId || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Missing user ID or cart items" }, { status: 400 })
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    // Fetch user email for PayFast
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single()

    if (userError || !userData?.email) {
      console.error("Error fetching user email:", userError)
      return NextResponse.json({ error: "Failed to retrieve user email for payment" }, { status: 500 })
    }

    // Create a new order in the database
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: "pending", // Initial status
        payment_method: "PayFast",
      })
      .select()
      .single()

    if (orderError || !orderData) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    const orderId = orderData.id

    // Insert order items
    const orderItemsToInsert = cartItems.map((item: any) => ({
      order_id: orderId,
      product_id: item.product_id, // Assuming product_id exists
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      item_total: item.price * item.quantity,
    }))

    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItemsToInsert)

    if (orderItemsError) {
      console.error("Error inserting order items:", orderItemsError)
      // Optionally, roll back the order creation here
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // Generate PayFast form fields
    const itemName = `Order #${orderId.substring(0, 8)}` // A descriptive name for the order
    const { url, fields } = getPayFastCheckoutForm(orderId, totalAmount, itemName, userData.email)

    // Update the order with the PayFast order ID (m_payment_id)
    const { error: updateOrderError } = await supabase
      .from("orders")
      .update({ payfast_order_id: orderId }) // m_payment_id is our internal orderId
      .eq("id", orderId)

    if (updateOrderError) {
      console.error("Failed to update order with PayFast ID:", updateOrderError)
      return NextResponse.json({ error: "Failed to update order with PayFast ID" }, { status: 500 })
    }

    // Return the PayFast URL and fields to the client
    return NextResponse.json({ url, fields }, { status: 200 })
  } catch (error) {
    console.error("Checkout process error:", error)
    return NextResponse.json({ error: "Internal server error during checkout" }, { status: 500 })
  }
}
