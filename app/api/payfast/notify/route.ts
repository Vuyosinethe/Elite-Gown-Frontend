import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { verifyPayFastSignature } from "@/lib/payfast"

export async function POST(request: NextRequest) {
  try {
    const itnData = await request.formData()
    const payload: Record<string, string> = {}
    for (const [key, value] of itnData.entries()) {
      payload[key] = String(value)
    }

    // 1. Verify the ITN signature
    const isValidSignature = verifyPayFastSignature(payload)
    if (!isValidSignature) {
      console.error("PayFast ITN: Invalid signature received.")
      return new NextResponse("Invalid signature", { status: 400 })
    }

    // 2. Extract relevant data from ITN payload
    const pfPaymentId = payload.pf_payment_id // PayFast's unique transaction ID
    const mPaymentId = payload.m_payment_id // Our custom order ID (payfast_order_id)
    const paymentStatus = payload.payment_status // e.g., 'COMPLETE', 'FAILED', 'PENDING'
    const amountGross = Number.parseFloat(payload.amount_gross)
    const amountFee = Number.parseFloat(payload.amount_fee)
    const amountNet = Number.parseFloat(payload.amount_net)
    const itemName = payload.item_name
    const itemDescription = payload.item_description
    const merchantId = payload.merchant_id

    // Retrieve our order using m_payment_id (custom_str1)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("payfast_order_id", mPaymentId)
      .single()

    if (orderError || !order) {
      console.error(`PayFast ITN: Order not found for m_payment_id: ${mPaymentId}`, orderError)
      return new NextResponse("Order not found", { status: 404 })
    }

    // 3. Update the transaction status in our database
    let transactionStatus: string
    let orderStatus: string

    switch (paymentStatus) {
      case "COMPLETE":
        transactionStatus = "complete"
        orderStatus = "completed"
        break
      case "FAILED":
        transactionStatus = "failed"
        orderStatus = "failed"
        break
      case "PENDING":
        transactionStatus = "pending"
        orderStatus = "pending"
        break
      case "CANCELLED":
        transactionStatus = "cancelled"
        orderStatus = "cancelled"
        break
      case "REFUNDED":
        transactionStatus = "refunded"
        orderStatus = "refunded"
        break
      default:
        transactionStatus = "unknown"
        orderStatus = "processing" // Or a more appropriate default
    }

    // Check if a transaction already exists for this pf_payment_id to prevent duplicates
    const { data: existingTransaction, error: existingTransactionError } = await supabase
      .from("transactions")
      .select("id")
      .eq("payfast_transaction_id", pfPaymentId)
      .single()

    if (existingTransactionError && existingTransactionError.code !== "PGRST116") {
      // PGRST116 means no rows found
      console.error("Error checking for existing transaction:", existingTransactionError)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    if (existingTransaction) {
      // Update existing transaction if it's a status change for the same transaction
      const { error: updateTransactionError } = await supabase
        .from("transactions")
        .update({
          status: transactionStatus,
          payment_status: paymentStatus,
          metadata: payload,
          amount_gross: amountGross,
          amount_fee: amountFee,
          amount_net: amountNet,
        })
        .eq("payfast_transaction_id", pfPaymentId)

      if (updateTransactionError) {
        console.error("Error updating existing transaction:", updateTransactionError)
        return new NextResponse("Internal Server Error", { status: 500 })
      }
    } else {
      // Insert new transaction
      const { error: insertTransactionError } = await supabase.from("transactions").insert({
        order_id: order.id,
        payfast_transaction_id: pfPaymentId,
        status: transactionStatus,
        amount_gross: amountGross,
        amount_fee: amountFee,
        amount_net: amountNet,
        payment_status: paymentStatus,
        item_name: itemName,
        item_description: itemDescription,
        merchant_id: merchantId,
        metadata: payload,
      })

      if (insertTransactionError) {
        console.error("Error inserting new transaction:", insertTransactionError)
        return new NextResponse("Internal Server Error", { status: 500 })
      }
    }

    // Update the order status
    const { error: updateOrderError } = await supabase.from("orders").update({ status: orderStatus }).eq("id", order.id)

    if (updateOrderError) {
      console.error("Error updating order status:", updateOrderError)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    // If payment is complete, clear the user's cart
    if (paymentStatus === "COMPLETE") {
      const { error: clearCartError } = await supabase.from("cart_items").delete().eq("user_id", order.user_id)

      if (clearCartError) {
        console.error("Error clearing user cart after successful payment:", clearCartError)
      }
    }

    return new NextResponse("ITN processed successfully", { status: 200 })
  } catch (error) {
    console.error("Error processing PayFast ITN:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
