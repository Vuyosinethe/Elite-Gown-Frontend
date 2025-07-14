import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { verifyPayFastSignature, verifyPayFastIp } from "@/lib/payfast"

// Initialize Supabase client
const supabase = createClient()

export async function POST(req: NextRequest) {
  const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || ""

  try {
    // PayFast sends ITN data as application/x-www-form-urlencoded
    const formData = await req.formData()
    const data: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      data[key] = String(value)
    }

    const ipAddress = req.ip || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || ""

    // 1. Verify IP address (security check)
    if (!verifyPayFastIp(ipAddress)) {
      console.warn(`PayFast ITN: Invalid IP address: ${ipAddress}`)
      return new NextResponse("Invalid IP", { status: 400 })
    }

    // 2. Verify signature (security check)
    const receivedSignature = data.signature
    if (!receivedSignature || !verifyPayFastSignature(data, receivedSignature, PAYFAST_PASSPHRASE)) {
      console.warn("PayFast ITN: Invalid signature received.")
      return new NextResponse("Invalid Signature", { status: 400 })
    }

    // 3. Process the ITN data
    const {
      m_payment_id: orderId, // Your custom payment ID (order ID)
      payment_status: payfastPaymentStatus,
      amount_gross: amountGross,
      // Add other fields you need from the ITN
    } = data

    if (!orderId || !payfastPaymentStatus || !amountGross) {
      console.error("PayFast ITN: Missing critical data in ITN payload.", data)
      return new NextResponse("Missing Data", { status: 400 })
    }

    // Convert amount to cents for database storage
    const amountGrossCents = Math.round(Number(amountGross) * 100)

    // Fetch the order from your database
    const { data: order, error: orderFetchError } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (orderFetchError || !order) {
      console.error("PayFast ITN: Order not found or fetch error:", orderFetchError)
      return new NextResponse("Order Not Found", { status: 404 })
    }

    // Prevent duplicate processing (optional, but good practice)
    if (order.status === "completed" && payfastPaymentStatus === "COMPLETE") {
      console.log(`PayFast ITN: Order ${orderId} already completed. Skipping.`)
      return new NextResponse("OK", { status: 200 }) // Acknowledge to PayFast
    }

    let newOrderStatus: string
    let transactionStatus: string

    switch (payfastPaymentStatus) {
      case "COMPLETE":
        newOrderStatus = "completed"
        transactionStatus = "success"
        break
      case "FAILED":
        newOrderStatus = "failed"
        transactionStatus = "failed"
        break
      case "CANCELLED":
        newOrderStatus = "cancelled"
        transactionStatus = "cancelled"
        break
      case "PENDING":
        newOrderStatus = "pending"
        transactionStatus = "pending"
        break
      default:
        newOrderStatus = "pending" // Default to pending for unknown statuses
        transactionStatus = "unknown"
        console.warn(`PayFast ITN: Unknown payment_status: ${payfastPaymentStatus} for order ${orderId}`)
    }

    // Update order status
    const { error: orderUpdateError } = await supabase
      .from("orders")
      .update({ status: newOrderStatus })
      .eq("id", orderId)

    if (orderUpdateError) {
      console.error("PayFast ITN: Error updating order status:", orderUpdateError)
      return new NextResponse("Order Update Failed", { status: 500 })
    }

    // Insert or update transaction record
    const { error: transactionError } = await supabase.from("transactions").insert({
      order_id: order.id,
      status: transactionStatus,
      payment_status: payfastPaymentStatus,
      amount_gross: amountGrossCents, // Store in cents
    })

    if (transactionError) {
      console.error("PayFast ITN: Error inserting transaction:", transactionError)
      return new NextResponse("Transaction Record Failed", { status: 500 })
    }

    // If payment is complete, clear the user's cart
    if (newOrderStatus === "completed") {
      const { error: cartClearError } = await supabase.from("cart_items").delete().eq("user_id", order.user_id)
      if (cartClearError) {
        console.error("PayFast ITN: Error clearing cart:", cartClearError)
      }
    }

    // Respond with "OK" to PayFast to acknowledge receipt of the ITN
    return new NextResponse("OK", { status: 200 })
  } catch (error: any) {
    console.error("PayFast ITN: General error processing ITN:", error.message)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
