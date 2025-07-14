import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { createPayFastFormFields } from "@/lib/payfast"

export async function POST(req: Request) {
  const supabase = createClient()

  try {
    const { cartItems, userId } = await req.json()

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart items are required" }, { status: 400 })
    }
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Calculate total amount in cents
    const totalAmountCents = cartItems.reduce(
      (sum, item) => sum + Math.round(Number(item.price) * 100) * Number(item.quantity),
      0,
    )
    const totalAmountRands = totalAmountCents / 100

    // 1. Create a new order in the database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: totalAmountCents, // Store in cents
        status: "pending", // Initial status
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // 2. Add order items
    const orderItemsToInsert = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: Math.round(Number(item.price) * 100), // Store in cents
      product_name: item.name,
      product_image: item.image,
    }))

    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItemsToInsert)

    if (orderItemsError) {
      console.error("Error adding order items:", orderItemsError)
      // Optionally, roll back the order creation here
      return NextResponse.json({ error: "Failed to add order items" }, { status: 500 })
    }

    // 3. Prepare PayFast checkout form fields
    const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const returnUrl = `${NEXT_PUBLIC_SITE_URL}/payfast/return`
    const cancelUrl = `${NEXT_PUBLIC_SITE_URL}/payfast/cancel`
    const notifyUrl = `${NEXT_PUBLIC_SITE_URL}/api/payfast/notify` // PayFast ITN URL

    const { payfastUrl, payfastFields } = createPayFastFormFields({
      orderId: order.id,
      totalAmount: totalAmountRands, // Send to PayFast in Rands
      userId: userId,
      cartItems: cartItems.map((item: any) => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: Number(item.price), // Ensure this is a number for toFixed in lib/payfast.ts
        image_url: item.image,
      })),
      returnUrl,
      cancelUrl,
      notifyUrl,
    })

    return NextResponse.json({ payfastUrl, payfastFields }, { status: 200 })
  } catch (error) {
    console.error("Error in /api/payfast/process:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
