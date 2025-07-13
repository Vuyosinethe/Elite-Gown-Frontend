"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import Layout from "@/components/layout"
import { supabase } from "@/lib/supabase"

interface OrderStatus {
  status: string
  total_amount: number
  payfast_order_id: string
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
        setError("No order ID found in the URL.")
        setLoading(false)
        return
      }

      try {
        // Fetch order details from your database
        const { data, error: dbError } = await supabase
          .from("orders")
          .select("status, total_amount, payfast_order_id")
          .eq("id", orderId)
          .single()

        if (dbError) {
          console.error("Error fetching order status:", dbError)
          setError("Failed to retrieve order details. Please check your account history.")
          setOrderStatus(null)
        } else if (data) {
          setOrderStatus(data)
        } else {
          setError("Order not found.")
          setOrderStatus(null)
        }
      } catch (err) {
        console.error("Unexpected error fetching order status:", err)
        setError("An unexpected error occurred. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderStatus()
  }, [orderId])

  const isSuccess = orderStatus?.status === "completed"

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center bg-white p-8 rounded-lg shadow-lg">
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-yellow-500 animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Processing your payment...</h2>
              <p className="mt-2 text-gray-600">Please do not close this page.</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center">
              <XCircle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-red-700">Payment Error</h2>
              <p className="mt-2 text-gray-600">{error}</p>
              <Link href="/account" className="mt-6 text-blue-600 hover:underline">
                View your account
              </Link>
            </div>
          ) : (
            <>
              {isSuccess ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              )}
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {isSuccess ? "Payment Successful!" : "Payment Unsuccessful"}
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                {isSuccess
                  ? `Your order #${orderId?.substring(0, 8)} for R${orderStatus?.total_amount.toFixed(2)} has been successfully processed.`
                  : `There was an issue with your payment for order #${orderId?.substring(0, 8)}. Status: ${orderStatus?.status || "Unknown"}.`}
              </p>
              <p className="text-sm text-gray-500">You will receive an email confirmation shortly.</p>
              <div className="mt-6 space-y-4">
                <Link
                  href="/account"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  View My Orders
                </Link>
                <Link href="/" className="block text-sm text-blue-600 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
