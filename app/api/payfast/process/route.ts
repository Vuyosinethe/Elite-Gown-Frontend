import { type NextRequest, NextResponse } from "next/server"
import { createPayFastFormFields } from "@/lib/payfast"
import { createClient } from "@/lib/supabase" // Assuming this imports your Supabase client

const toNumber = (value: string | number) => (typeof value === "number" ? value : Number.parseFloat(value))

const toCents = (rands: string | number) =>
  Math.round(typeof rands === "number" ? rands * 100 : Number.parseFloat(rands) * 100)

export async function POST(request: NextRequest) {
  const supabase = createClient() // Initialize Supabase client

  try {
    const raw = await request.json()
    const cartItems = raw.cartItems as any[]
    const userId = raw.userId
    const totalAmountNum = toNumber(raw.totalAmount) // rands as number

    if (!totalAmountNum || !userId || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Missing required fields for checkout" }, { status: 400 })
    }

    // incoming totalAmount is a string/number in rands → store cents in DB
    const totalAmountCents = toCents(totalAmountNum)

    // 1. Create an order in your database
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: totalAmountCents, // ← integer cents
        status: "pending", // Initial status
      })
      .select()
      .single()

    if (orderError || !orderData) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: orderError?.message || "Failed to create order." }, { status: 500 })
    }

    const orderId = orderData.id

    // 2. Add order items
    const itemsToInsert = cartItems.map((item: any) => ({
      order_id: orderId,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: toCents(item.price), // ← integer cents
      product_image: item.product_image || null,
    }))

    const { error: orderItemsError } = await supabase.from("order_items").insert(itemsToInsert)

    if (orderItemsError) {
      console.error("Error adding order items:", orderItemsError)
      return NextResponse.json({ error: orderItemsError.message || "Failed to add order items." }, { status: 500 })
    }

    // 3. Generate PayFast form fields
    const payfastCartItems = cartItems.map((item) => ({
      ...item,
      price: toNumber(item.price), // ensure number for toFixed(2)
    }))

    const payfastFields = createPayFastFormFields(
      totalAmountNum, // Pass total amount in Rands
      orderId,
      userId,
      payfastCartItems,
    )

    return NextResponse.json({
      payfastUrl: process.env.PAYFAST_SANDBOX_URL,
      payfastFields,
    })
  } catch (error) {
    console.error("Error in /api/payfast/process:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
