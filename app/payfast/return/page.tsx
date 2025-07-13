"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PayFastReturnPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"success" | "cancelled" | "pending" | "loading" | "error">("loading")
  const [message, setMessage] = useState("Processing your payment...")
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const pfPaymentId = searchParams.get("pf_payment_id")
    const paymentStatus = searchParams.get("payment_status")
    const mPaymentId = searchParams.get("m_payment_id") // Our custom order ID

    setOrderId(mPaymentId)

    if (paymentStatus === "COMPLETE") {
      setStatus("success")
      setMessage("Your payment was successful! Thank you for your purchase.")
    } else if (paymentStatus === "CANCELLED") {
      setStatus("cancelled")
      setMessage("Your payment was cancelled. Please try again or contact support.")
    } else if (paymentStatus === "FAILED") {
      setStatus("error")
      setMessage("Your payment failed. Please try again or contact support.")
    } else if (paymentStatus === "PENDING") {
      setStatus("pending")
      setMessage("Your payment is pending. We will notify you once it's confirmed.")
    } else {
      setStatus("error")
      setMessage("Payment status could not be determined. Please check your order history.")
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          {status === "loading" && <Loader2 className="mx-auto h-12 w-12 text-gray-500 animate-spin" />}
          {status === "success" && <CheckCircle className="mx-auto h-12 w-12 text-green-500" />}
          {status === "cancelled" && <XCircle className="mx-auto h-12 w-12 text-red-500" />}
          {status === "pending" && <Loader2 className="mx-auto h-12 w-12 text-yellow-500 animate-spin" />}
          {status === "error" && <XCircle className="mx-auto h-12 w-12 text-red-500" />}
          <CardTitle className="mt-4 text-2xl font-bold">
            {status === "success" && "Payment Successful!"}
            {status === "cancelled" && "Payment Cancelled"}
            {status === "pending" && "Payment Pending"}
            {status === "error" && "Payment Failed"}
            {status === "loading" && "Processing Payment..."}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{message}</p>
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
