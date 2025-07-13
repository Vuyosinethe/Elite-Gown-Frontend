import { type NextRequest, NextResponse } from "next/server"
import { verifyPayFastSignature } from "@/lib/payfast"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    const signature = data.signature
    delete data.signature // Remove signature before verification

    if (!signature || !verifyPayFastSignature(data, signature)) {
      console.error("PayFast ITN: Invalid signature")
      return new NextResponse("Invalid signature", { status: 400 })
    }

    const payfastTransactionId = data.pf_payment_id
    const orderId = data.m_payment_id // This is our internal order ID
    const paymentStatus = data.payment_status // e.g., COMPLETE, FAILED, PENDING
    const amountGross = Number.parseFloat(data.amount_gross)

    if (!orderId || !payfastTransactionId || !paymentStatus || isNaN(amountGross)) {
      console.error("PayFast ITN: Missing or invalid required fields in ITN data", data)
      return new NextResponse("Missing or invalid ITN data", { status: 400 })
    }

    // Check if transaction already exists to prevent duplicate processing
    const { data: existingTransaction, error: existingTransactionError } = await supabase
      .from("transactions")
      .select("id")
      .eq("payfast_transaction_id", payfastTransactionId)
      .single()

    if (existingTransactionError && existingTransactionError.code !== "PGRST116") {
      // PGRST116 is "not found"
      console.error("Error checking existing transaction:", existingTransactionError)
      return new NextResponse("Internal server error", { status: 500 })
    }

    if (existingTransaction) {
      console.warn(`PayFast ITN: Transaction ${payfastTransactionId} already processed.`)
      return new NextResponse("Transaction already processed", { status: 200 }) // Acknowledge success
    }

    // Insert new transaction record
    const { data: newTransaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        order_id: orderId,
        payfast_transaction_id: payfastTransactionId,
        amount: amountGross,
        status: paymentStatus,
        payment_method: data.payment_method || "unknown",
        metadata: data, // Store full ITN data for debugging/auditing
      })
      .select()
      .single()

    if (transactionError || !newTransaction) {
      console.error("Error inserting transaction:", transactionError)
      return new NextResponse("Failed to record transaction", { status: 500 })
    }

    // Update order status based on payment status
    let orderStatus = "pending"
    if (paymentStatus === "COMPLETE") {
      orderStatus = "completed"
    } else if (paymentStatus === "FAILED") {
      orderStatus = "failed"
    } else if (paymentStatus === "CANCELLED") {
      orderStatus = "cancelled"
    }

    const { error: orderUpdateError } = await supabase
      .from("orders")
      .update({ status: orderStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (orderUpdateError) {
      console.error("Error updating order status:", orderUpdateError)
      return new NextResponse("Failed to update order status", { status: 500 })
    }

    console.log(`PayFast ITN: Order ${orderId} updated to status: ${orderStatus}`)
    return new NextResponse("ITN received and processed", { status: 200 })
  } catch (error) {
    console.error("PayFast ITN processing error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
