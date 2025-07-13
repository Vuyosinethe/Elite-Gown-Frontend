import { type NextRequest, NextResponse } from "next/server"
import { verifySignature } from "@/lib/payfast"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    const pfSignature = data.signature
    delete data.signature // Remove signature before verification

    // Verify the signature
    const isValid = verifySignature(data, pfSignature, process.env.PAYFAST_PASSPHRASE)

    if (!isValid) {
      console.error("PayFast ITN: Invalid signature received.")
      return new NextResponse("Invalid signature", { status: 400 })
    }

    const {
      m_payment_id: orderId, // Our internal order ID
      pf_payment_id: transactionId, // PayFast's unique transaction ID
      payment_status: status, // e.g., COMPLETE, FAILED, PENDING
      amount_gross: amount,
      item_name: itemName,
      // ... other fields you might want to store
    } = data

    if (!orderId || !transactionId || !status || !amount) {
      console.error("PayFast ITN: Missing required fields in ITN data.", data)
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Convert amount to number
    const parsedAmount = Number.parseFloat(amount)

    // Check if transaction already exists to prevent duplicates
    const { data: existingTransaction, error: existingTransactionError } = await supabase
      .from("transactions")
      .select("id")
      .eq("transaction_id", transactionId)
      .single()

    if (existingTransactionError && existingTransactionError.code !== "PGRST116") {
      // PGRST116 is "not found"
      console.error("PayFast ITN: Error checking existing transaction:", existingTransactionError)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    if (existingTransaction) {
      console.warn(`PayFast ITN: Duplicate transaction ID received: ${transactionId}. Skipping insertion.`)
      return new NextResponse("OK", { status: 200 }) // Acknowledge to PayFast
    }

    // Insert transaction record
    const { data: transactionData, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        order_id: orderId,
        transaction_id: transactionId,
        status: status,
        amount: parsedAmount,
        payment_method: "PayFast", // Or derive from data if available
        metadata: data, // Store all ITN data for debugging/future use
      })
      .select()
      .single()

    if (transactionError || !transactionData) {
      console.error("PayFast ITN: Error inserting transaction:", transactionError)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    // Update order status based on payment status
    let newOrderStatus: string
    switch (status) {
      case "COMPLETE":
        newOrderStatus = "completed"
        break
      case "FAILED":
        newOrderStatus = "failed"
        break
      case "PENDING":
        newOrderStatus = "pending"
        break
      default:
        newOrderStatus = "pending" // Default or handle unknown statuses
    }

    const { error: orderUpdateError } = await supabase
      .from("orders")
      .update({ status: newOrderStatus, payfast_order_id: transactionId }) // Also store PayFast's transaction ID in order
      .eq("id", orderId)

    if (orderUpdateError) {
      console.error("PayFast ITN: Error updating order status:", orderUpdateError)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    console.log(
      `PayFast ITN: Successfully processed transaction ${transactionId} for order ${orderId}. Status: ${status}`,
    )
    return new NextResponse("OK", { status: 200 }) // Acknowledge to PayFast
  } catch (error) {
    console.error("PayFast ITN: Uncaught error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
