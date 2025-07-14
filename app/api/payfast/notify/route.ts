import { type NextRequest, NextResponse } from "next/server"
import { verifyPayFastSignature, verifyPayFastIp } from "@/lib/payfast"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    // 1. Verify ITN IP address
    const clientIp = request.headers.get("x-forwarded-for") || request.ip
    if (!clientIp || !verifyPayFastIp(clientIp)) {
      console.warn(`PayFast ITN: Invalid IP address: ${clientIp}`)
      return new NextResponse("Forbidden", { status: 403 })
    }

    // 2. Parse form data
    const formData = await request.formData()
    const data: Record<string, string | number> = {}
    for (const [key, value] of formData.entries()) {
      data[key] = value
    }

    // 3. Verify ITN signature
    if (!verifyPayFastSignature(data)) {
      console.warn("PayFast ITN: Invalid signature.")
      return new NextResponse("Forbidden", { status: 403 })
    }

    // 4. Verify payment status and update database
    const pfPaymentId = data.pf_payment_id as string
    const pfTransactionId = data.pf_transaction_id as string
    const mPaymentId = data.m_payment_id as string // Your order ID
    const paymentStatus = data.payment_status as string // e.g., COMPLETE, FAILED, PENDING
    const amountGross = Number.parseFloat(data.amount_gross as string)
    const customStr1 = data.custom_str1 as string // user_id
    const customStr2 = data.custom_str2 as string // order_id

    // Fetch the order to ensure it exists and matches
    const { data: order, error: orderFetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", mPaymentId)
      .single()

    if (orderFetchError || !order) {
      console.error(`PayFast ITN: Order not found or error fetching order ${mPaymentId}:`, orderFetchError)
      return new NextResponse("Order Not Found", { status: 404 })
    }

    // Check if the amount matches (important for security)
    if (order.total_amount !== amountGross) {
      console.warn(
        `PayFast ITN: Amount mismatch for order ${mPaymentId}. Expected ${order.total_amount}, received ${amountGross}.`,
      )
      // You might want to log this as a potential fraud attempt or error
      return new NextResponse("Amount Mismatch", { status: 400 })
    }

    let transactionStatus = "pending"
    let orderStatus = "pending"

    switch (paymentStatus) {
      case "COMPLETE":
        transactionStatus = "success"
        orderStatus = "completed"
        break
      case "FAILED":
        transactionStatus = "failed"
        orderStatus = "failed"
        break
      case "CANCELLED":
        transactionStatus = "cancelled"
        orderStatus = "cancelled"
        break
      case "PENDING":
        transactionStatus = "pending"
        orderStatus = "pending"
        break
      default:
        transactionStatus = "unknown"
        orderStatus = "pending"
        break
    }

    // Update order status
    const { error: updateOrderError } = await supabase
      .from("orders")
      .update({ status: orderStatus })
      .eq("id", mPaymentId)

    if (updateOrderError) {
      console.error(`PayFast ITN: Error updating order status for ${mPaymentId}:`, updateOrderError)
      return new NextResponse("Error Updating Order", { status: 500 })
    }

    // Insert or update transaction record
    const { data: existingTransaction, error: fetchTransactionError } = await supabase
      .from("transactions")
      .select("*")
      .eq("pf_transaction_id", pfTransactionId)
      .single()

    if (fetchTransactionError && fetchTransactionError.code !== "PGRST116") {
      // PGRST116 means no rows found
      console.error(`PayFast ITN: Error fetching existing transaction ${pfTransactionId}:`, fetchTransactionError)
      return new NextResponse("Error Fetching Transaction", { status: 500 })
    }

    if (existingTransaction) {
      // Update existing transaction
      const { error: updateTransactionError } = await supabase
        .from("transactions")
        .update({
          status: transactionStatus,
          payment_status: paymentStatus,
          amount_gross: amountGross,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingTransaction.id)

      if (updateTransactionError) {
        console.error(`PayFast ITN: Error updating transaction ${existingTransaction.id}:`, updateTransactionError)
        return new NextResponse("Error Updating Transaction", { status: 500 })
      }
    } else {
      // Insert new transaction
      const { error: insertTransactionError } = await supabase.from("transactions").insert({
        order_id: mPaymentId,
        status: transactionStatus,
        payment_status: paymentStatus,
        amount_gross: amountGross,
        pf_payment_id: pfPaymentId,
        pf_transaction_id: pfTransactionId,
        pf_item_name: data.item_name,
        pf_item_description: data.item_description,
        pf_signature: data.signature,
        user_id: customStr1, // Store user_id from custom_str1
      })

      if (insertTransactionError) {
        console.error(`PayFast ITN: Error inserting new transaction for order ${mPaymentId}:`, insertTransactionError)
        return new NextResponse("Error Inserting Transaction", { status: 500 })
      }
    }

    // If payment is complete, clear the user's cart
    if (paymentStatus === "COMPLETE") {
      const { error: clearCartError } = await supabase.from("cart_items").delete().eq("user_id", customStr1)
      if (clearCartError) {
        console.error(`PayFast ITN: Error clearing cart for user ${customStr1}:`, clearCartError)
      }
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("Error in /api/payfast/notify:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
