'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function PayFastReturnPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'unknown'>('loading')
  const [message, setMessage] = useState('Processing your payment...')
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const pfPaymentId = searchParams.get('pf_payment_id')
    const mPaymentId = searchParams.get('m_payment_id') // Our internal order ID
    const paymentStatus = searchParams.get('payment_status') // PayFast status

    setOrderId(mPaymentId)

    if (paymentStatus === 'COMPLETE') {
      setStatus('success')
      setMessage('Your payment was successful! Thank you for your purchase.')
    } else if (paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') {
      setStatus('failed')
      setMessage('Your payment could not be processed. Please try again or contact support.')
    } else if (paymentStatus === 'PENDING') {
      setStatus('unknown') // Treat pending as unknown for immediate display
      setMessage('Your payment is pending. We will notify you once it is confirmed.')
    } else {
      setStatus('unknown')
      setMessage('Payment status is unknown. Please check your order history or contact support.')
    }

    // Optional: Fetch the actual order status from your backend for confirmation
    // This is good practice as the ITN is the definitive source of truth
    const fetchOrderStatus = async () => {
      if (mPaymentId) {
        const { data, error } = await supabase
          .from('orders')
          .select('status')
          .eq('id', mPaymentId)
          .single()

        if (error) {
          console.error('Error fetching order status:', error.message)
          // Keep current message, but log error
        } else if (data) {
          if (data.status === 'completed') {
            setStatus('success')
            setMessage('Your payment was successful! Thank you for your purchase.')
          } else if (data.status === 'failed' || data.status === 'cancelled') {
            setStatus('failed')
            setMessage('Your payment could not be processed. Please try again or contact support.')
          } else if (data.status === 'pending') {
            setStatus('unknown')
            setMessage('Your payment is pending. We will notify you once it is confirmed.')
          }
        }
      }
    }

    fetchOrderStatus()
  }, [searchParams])

  const Icon =
    status === 'success' ? CheckCircle : status === 'failed' ? XCircle : Loader2
  const iconColor =
    status === 'success' ? 'text-green-500' : status === 'failed' ? 'text-red-500' : 'text-blue-500'

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Payment {status === 'success' ? 'Successful' : status === 'failed' ? 'Failed' : 'Status'}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 p-6">
          <Icon className={`h-20 w-20 ${iconColor} animate-pulse`} />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{message}</p>
          {orderId && (
            <p className="text-sm text-muted-foreground">Order ID: {orderId}</p>
          )}
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/account">View My Orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
