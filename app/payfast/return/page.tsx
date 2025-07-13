"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Layout from "@/components/layout"
import { supabase } from "@/lib/supabase"

interface OrderStatus {
  status: string
  total_amount: number
  order_date: string
}

export default function PayFastReturnPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!orderId) {
        setError("Order ID not found in URL.")
        setLoading(false)
        return
      }

      try {
        // Fetch order details from your database
        const { data, error: dbError } = await supabase
          .from("orders")
          .select("status, total_amount, order_date")
          .eq("id", orderId)
          .single()

        if (dbError) {
          console.error("Error fetching order status:", dbError)
          setError("Failed to retrieve order details. Please check your account for updates.")
        } else if (data) {
          setOrderStatus(data)
        } else {
          setError("Order not found.")
        }
      } catch (err) {
        console.error("An unexpected error occurred:", err)
        setError("An unexpected error occurred while fetching order details.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderStatus()
  }, [orderId])

  const isSuccess = orderStatus?.status === "completed"

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            {loading ? (
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-yellow-500" />
            ) : isSuccess ? (
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
            )}
            <CardTitle className="mt-4 text-2xl">
              {loading ? "Processing Payment..." : isSuccess ? "Payment Successful!" : "Payment Failed or Cancelled"}
            </CardTitle>
            <CardDescription>
              {loading
                ? "Please wait while we confirm your order."
                : isSuccess
                  ? "Your order has been placed successfully."
                  : "There was an issue with your payment or it was cancelled."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <p>Fetching order details...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {orderStatus && (
              <>
                <p className="text-lg font-semibold">Order ID: {orderId}</p>
                <p>
                  Status:{" "}
                  <span className={`font-bold ${isSuccess ? "text-green-600" : "text-red-600"}`}>
                    {orderStatus.status.toUpperCase()}
                  </span>
                </p>
                <p>Total Amount: R{orderStatus.total_amount.toFixed(2)}</p>
                <p>Order Date: {new Date(orderStatus.order_date).toLocaleDateString()}</p>
              </>
            )}
            <div className="flex flex-col gap-2 pt-4">
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
    </Layout>
  )
}
