"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PayFastCancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const mPaymentId = searchParams.get("m_payment_id")
    setOrderId(mPaymentId)
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <CardTitle className="mt-4 text-2xl font-bold">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">Your payment was cancelled. No charges have been made.</p>
          {orderId && (
            <p className="text-sm text-gray-500">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          )}
          <div className="flex flex-col gap-2">
            <Link href="/account?tab=orders">
              <Button className="w-full">View My Orders</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
