"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PayFastReturnPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"success" | "cancelled" | "failed" | "pending" | "unknown">("unknown")
  const [message, setMessage] = useState("")
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const paymentStatus = searchParams.get("payment_status")
    const mPaymentId = searchParams.get("m_payment_id") // Your custom payment ID

    setOrderId(mPaymentId)

    if (paymentStatus === "COMPLETE") {
      setStatus("success")
      setMessage("Your payment was successful! Thank you for your purchase.")
    } else if (paymentStatus === "CANCELLED") {
      setStatus("cancelled")
      setMessage("Your payment was cancelled. You can try again or contact support.")
    } else if (paymentStatus === "FAILED") {
      setStatus("failed")
      setMessage("Your payment failed. Please try again or contact support.")
    } else if (paymentStatus === "PENDING") {
      setStatus("pending")
      setMessage("Your payment is pending. We will notify you once it's confirmed.")
    } else {
      setStatus("unknown")
      setMessage("We could not determine the status of your payment. Please check your order history.")
    }
  }, [searchParams])

  const getIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "cancelled":
      case "failed":
        return <XCircle className="h-16 w-16 text-red-500" />
      case "pending":
      case "unknown":
      default:
        return <XCircle className="h-16 w-16 text-yellow-500" /> // Using XCircle for pending/unknown for now
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center">{getIcon()}</div>
          <CardTitle className="mt-4 text-2xl font-bold">
            {status === "success"
              ? "Payment Successful!"
              : status === "cancelled"
                ? "Payment Cancelled"
                : status === "failed"
                  ? "Payment Failed"
                  : "Payment Status Unknown"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderId && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Order Reference: <span className="font-medium">{orderId}</span>
            </p>
          )}
          <div className="flex flex-col gap-2">
            <Link href="/products" passHref>
              <Button className="w-full">Continue Shopping</Button>
            </Link>
            <Link href="/account/orders" passHref>
              <Button variant="outline" className="w-full bg-transparent">
                View Your Orders
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
