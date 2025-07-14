"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function PayFastReturnPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"success" | "failed" | "pending">("pending")
  const [message, setMessage] = useState("Processing your payment...")

  useEffect(() => {
    const paymentStatus = searchParams.get("payment_status")
    const orderId = searchParams.get("m_payment_id")

    if (paymentStatus === "COMPLETE") {
      setStatus("success")
      setMessage(`Payment successful for Order ID: ${orderId}. Thank you for your purchase!`)
    } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
      setStatus("failed")
      setMessage(`Payment ${paymentStatus.toLowerCase()} for Order ID: ${orderId}. Please try again.`)
    } else {
      // Fallback for other statuses or if status is not immediately available
      setStatus("pending")
      setMessage("Your payment is being processed. Please check your order history for updates.")
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {status === "pending" && <Loader2 className="mx-auto h-16 w-16 text-gray-500 animate-spin" />}
        {status === "success" && <CheckCircle className="mx-auto h-16 w-16 text-green-500" />}
        {status === "failed" && <XCircle className="mx-auto h-16 w-16 text-red-500" />}
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          {status === "success" ? "Payment Successful!" : status === "failed" ? "Payment Failed" : "Payment Processing"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 space-y-3">
          <Link href="/account" className="block">
            <Button className="w-full">View My Orders</Button>
          </Link>
          <Link href="/products" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
