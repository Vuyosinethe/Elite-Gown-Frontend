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

    const payfastSignature = data.signature
    delete data.signature // Remove signature before verification

    if (!payfastSignature || !verifySignature(data, payfastSignature)) {
      console.error("PayFast ITN: Invalid signature.")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const {
      m_payment_id: orderId,
      pf_payment_id: payfastTransactionId,
      payment_status: paymentStatus,
      amount_gross,
      amount_fee,
      amount_net,
      item_name,
      item_description,
      merchant_id,
    } = data

    if (!orderId || !payfastTransactionId || !paymentStatus) {
      console.error("PayFast ITN: Missing required fields in ITN data.")
      return NextResponse.json({ error: "Missing required ITN fields" }, { status: 400 })
    }

    // Update order status based on PayFast payment status
    let orderStatus: string
    switch (paymentStatus) {
      case "COMPLETE":
        orderStatus = "completed"
        break
      case "FAILED":
        orderStatus = "failed"
        break
      case "PENDING":
        orderStatus = "pending"
        break
      case "CANCELLED":
        orderStatus = "cancelled"
        break
      default:
        orderStatus = "unknown"
    }

    // Update the order status in your database
    const { data: updatedOrder, error: orderUpdateError } = await supabase
      .from("orders")
      .update({ status: orderStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single()

    if (orderUpdateError) {
      console.error("PayFast ITN: Error updating order status:", orderUpdateError)
      return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
    }

    // Insert or update transaction record
    const { error: transactionError } = await supabase.from("transactions").upsert(
      {
        order_id: orderId,
        payfast_transaction_id: payfastTransactionId,
        status: orderStatus,
        amount_gross: Number.parseFloat(amount_gross),
        amount_fee: Number.parseFloat(amount_fee),
        amount_net: Number.parseFloat(amount_net),
        item_name: item_name,
        item_description: item_description,
        merchant_id: merchant_id,
        signature: payfastSignature,
        payment_status: paymentStatus,
        m_payment_id: orderId,
        pf_payment_id: payfastTransactionId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "payfast_transaction_id" }, // Use payfast_transaction_id as conflict target
    )

    if (transactionError) {
      console.error("PayFast ITN: Error upserting transaction:", transactionError)
      return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 })
    }

    console.log(`PayFast ITN: Order ${orderId} status updated to ${orderStatus}. Transaction recorded.`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PayFast ITN: General error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
