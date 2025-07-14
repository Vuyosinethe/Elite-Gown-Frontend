"use client"

import { Button } from "@/components/ui/button"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { XCircle } from "lucide-react"
import Layout from "@/components/layout"

export default function PayFastCancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const mPaymentId = searchParams.get("m_payment_id")
    if (mPaymentId) {
      setOrderId(mPaymentId)
    }
  }, [searchParams])

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Payment Cancelled</h2>
            <p className="mt-2 text-sm text-gray-600">Your payment was cancelled. No charges have been made.</p>
            {orderId && (
              <p className="mt-2 text-sm text-gray-500">
                Order ID: <span className="font-medium">{orderId}</span>
              </p>
            )}
          </div>
          <div className="mt-6">
            <Button onClick={() => router.push("/products")} className="w-full">
              Continue Shopping
            </Button>
            <Button variant="outline" onClick={() => router.push("/cart")} className="mt-3 w-full">
              Go to Cart
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
