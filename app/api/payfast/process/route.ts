import { NextResponse } from 'next/server'
import { getPayFastFormFields, PAYFAST_URL } from '@/lib/payfast'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    const supabaseServer = supabase.auth.getSession()
    const { data: sessionData, error: sessionError } = await supabaseServer

    if (sessionError || !sessionData?.session) {
      console.error('Authentication error:', sessionError?.message)
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userId = sessionData.session.user.id
    const userEmail = sessionData.session.user.email || 'guest@example.com'

    const { cartItems } = await req.json()

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    // 1. Create a new order in your database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending', // Initial status
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Error creating order:', orderError?.message)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // 2. Insert order items
    const orderItemsData = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id, // Assuming item.id is your product_id
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: orderItemsError } = await supabase.from('order_items').insert(orderItemsData)

    if (orderItemsError) {
      console.error('Error inserting order items:', orderItemsError.message)
      // Optionally, roll back the order creation here
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 })
    }

    // 3. Generate PayFast form fields
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' // Ensure this is set in Vercel env vars

    const payFastFields = getPayFastFormFields(
      order.id,
      totalAmount,
      'EliteGowns Order',
      userEmail,
      `${siteUrl}/payfast/return`,
      `${siteUrl}/payfast/cancel`,
      `${siteUrl}/api/payfast/notify`
    )

    // 4. Update the order with the PayFast order ID (our internal order ID)
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({ payfast_order_id: order.id }) // Use our internal order ID as PayFast's m_payment_id
      .eq('id', order.id)

    if (updateOrderError) {
      console.error('Failed to update order with PayFast ID:', updateOrderError.message)
      // Optionally, roll back the order and order items here
      await supabase.from('order_items').delete().eq('order_id', order.id)
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Failed to update order with PayFast ID' }, { status: 500 })
    }

    // Return PayFast URL and form fields to the client
    return NextResponse.json({ payFastUrl: PAYFAST_URL, payFastFields })
  } catch (error) {
    console.error('Checkout process failed:', error)
    return NextResponse.json({ error: 'Internal server error during checkout' }, { status: 500 })
  }
}
