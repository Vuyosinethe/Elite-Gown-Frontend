import { NextResponse } from 'next/server'
import { verifyPayFastSignature } from '@/lib/payfast'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    const pfSignature = data.signature
    delete data.signature // Remove signature before verification

    // 1. Verify the signature
    if (!verifyPayFastSignature(data, pfSignature)) {
      console.error('PayFast ITN: Invalid signature')
      return new NextResponse('Invalid signature', { status: 400 })
    }

    const mPaymentId = data.m_payment_id // Our internal order ID
    const pfPaymentId = data.pf_payment_id // PayFast's unique transaction ID
    const paymentStatus = data.payment_status // e.g., 'COMPLETE', 'FAILED', 'PENDING'
    const amountGross = parseFloat(data.amount_gross)
    const item_name = data.item_name
    const item_description = data.item_description

    // 2. Check if the transaction ID has already been processed
    const { data: existingTransaction, error: existingTransactionError } = await supabase
      .from('transactions')
      .select('id')
      .eq('payfast_transaction_id', pfPaymentId)
      .single()

    if (existingTransactionError && existingTransactionError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error checking existing transaction:', existingTransactionError.message)
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    if (existingTransaction) {
      console.warn(`PayFast ITN: Transaction ${pfPaymentId} already processed.`)
      return new NextResponse('OK', { status: 200 }) // Already processed, acknowledge
    }

    // 3. Get the order from your database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', mPaymentId)
      .single()

    if (orderError || !order) {
      console.error('PayFast ITN: Order not found or error fetching order:', orderError?.message)
      return new NextResponse('Order not found', { status: 404 })
    }

    // 4. Verify amount matches
    if (order.total_amount !== amountGross) {
      console.error(`PayFast ITN: Amount mismatch for order ${mPaymentId}. Expected ${order.total_amount}, got ${amountGross}.`)
      return new NextResponse('Amount mismatch', { status: 400 })
    }

    // 5. Update order status and create transaction record
    let newOrderStatus = order.status
    let transactionStatus = 'PENDING'

    switch (paymentStatus) {
      case 'COMPLETE':
        newOrderStatus = 'completed'
        transactionStatus = 'COMPLETE'
        break
      case 'FAILED':
        newOrderStatus = 'failed'
        transactionStatus = 'FAILED'
        break
      case 'PENDING':
        newOrderStatus = 'pending'
        transactionStatus = 'PENDING'
        break
      case 'CANCELLED':
        newOrderStatus = 'cancelled'
        transactionStatus = 'CANCELLED'
        break
      default:
        console.warn(`PayFast ITN: Unknown payment status: ${paymentStatus} for order ${mPaymentId}`)
        transactionStatus = 'UNKNOWN'
        break
    }

    // Update order status
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({ status: newOrderStatus })
      .eq('id', order.id)

    if (updateOrderError) {
      console.error('Error updating order status:', updateOrderError.message)
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    // Create transaction record
    const { error: transactionError } = await supabase.from('transactions').insert({
      order_id: order.id,
      payfast_transaction_id: pfPaymentId,
      amount: amountGross,
      status: transactionStatus,
      payment_method: 'PayFast', // Or data.payment_method if available
      raw_data: data, // Store the full payload
    })

    if (transactionError) {
      console.error('Error inserting transaction:', transactionError.message)
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    console.log(`PayFast ITN: Order ${mPaymentId} updated to ${newOrderStatus}, Transaction ${pfPaymentId} recorded as ${transactionStatus}.`)
    return new NextResponse('OK', { status: 200 }) // Acknowledge successful processing
  } catch (error) {
    console.error('PayFast ITN processing error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
