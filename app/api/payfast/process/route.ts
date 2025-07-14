import { NextResponse } from "next/server"
import { getPayFastCheckoutForm } from "@/lib/payfast"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { orderId, totalAmount, userId, userEmail, cartItems } = await req.json()

    if (!orderId || !totalAmount || !userId || !userEmail || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Missing required order details" }, { status: 400 })
    }

    // 1. Create the order in the database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        user_id: userId,
        total_amount: totalAmount,
        status: "pending", // Initial status
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // 2. Insert order items
    const orderItemsToInsert = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image_url: item.image,
    }))

    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItemsToInsert)

    if (orderItemsError) {
      console.error("Error inserting order items:", orderItemsError)
      // Optionally, roll back the order creation here
      return NextResponse.json({ error: "Failed to insert order items" }, { status: 500 })
    }

    // 3. Generate PayFast form fields
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000" // Fallback for local development

    const returnUrl = `${siteUrl}/payfast/return`
    const cancelUrl = `${siteUrl}/payfast/cancel`
    const notifyUrl = `${siteUrl}/api/payfast/notify`

    const { url, fields } = getPayFastCheckoutForm(
      order.id,
      totalAmount,
      `Elite Gowns Order ${order.id}`,
      userEmail,
      returnUrl,
      cancelUrl,
      notifyUrl,
    )

    // 4. Update the order with the PayFast order ID (m_payment_id)
    const { error: updateOrderError } = await supabase
      .from("orders")
      .update({ payfast_order_id: order.id }) // m_payment_id is our order.id
      .eq("id", order.id)

    if (updateOrderError) {
      console.error("Error updating order with PayFast ID:", updateOrderError)
      return NextResponse.json({ error: "Failed to update order with PayFast ID" }, { status: 500 })
    }

    return NextResponse.json({ success: true, payfastUrl: url, payfastFields: fields })
  } catch (error) {
    console.error("Checkout process error:", error)
    return NextResponse.json({ error: "Internal server error during checkout" }, { status: 500 })
  }
}
