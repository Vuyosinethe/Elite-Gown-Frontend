"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import Layout from "@/components/layout"
import { supabase } from "@/lib/supabase"
import Button from "@/components/button" // Assuming Button component is imported from "@/components/button"

interface OrderStatus {
  status: string
  message: string
  icon: React.ElementType
  color: string
}

export default function PayFastReturnPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const mPaymentId = searchParams.get("m_payment_id")
    const pfPaymentId = searchParams.get("pf_payment_id")
    const paymentStatus = searchParams.get("payment_status") // This is from PayFast's redirect, not ITN

    const fetchOrderStatus = async (orderId: string) => {
      setLoading(true)
      setError(null)
      try {
        // Fetch the order and transaction details from your database
        // The ITN (notify) endpoint should have already updated the status
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .select("status, transactions(status, payment_status)")
          .eq("id", orderId)
          .single()

        if (orderError || !order) {
          console.error("Error fetching order status:", orderError)
          setError("Could not find your order details. Please check your account history.")
          setOrderStatus({
            status: "unknown",
            message: "Order not found or an error occurred.",
            icon: XCircle,
            color: "text-red-500",
          })
          return
        }

        let displayStatus = order.status
        let displayMessage = "Your payment status is unknown."
        let displayIcon: React.ElementType = Clock
        let displayColor = "text-gray-500"

        // Prioritize transaction status if available and more specific
        if (order.transactions && order.transactions.length > 0) {
          const transaction = order.transactions[0]
          switch (transaction.payment_status) {
            case "COMPLETE":
              displayStatus = "completed"
              displayMessage = "Your payment was successful! Thank you for your order."
              displayIcon = CheckCircle
              displayColor = "text-green-500"
              break
            case "FAILED":
              displayStatus = "failed"
              displayMessage = "Your payment failed. Please try again or contact support."
              displayIcon = XCircle
              displayColor = "text-red-500"
              break
            case "PENDING":
              displayStatus = "pending"
              displayMessage = "Your payment is pending. We will confirm your order once it clears."
              displayIcon = Clock
              displayColor = "text-yellow-500"
              break
            case "CANCELLED":
              displayStatus = "cancelled"
              displayMessage = "Your payment was cancelled."
              displayIcon = XCircle
              displayColor = "text-red-500"
              break
            default:
              // Fallback to order.status if transaction status is not clear
              switch (order.status) {
                case "completed":
                  displayMessage = "Your order has been completed."
                  displayIcon = CheckCircle
                  displayColor = "text-green-500"
                  break
                case "pending":
                  displayMessage = "Your order is pending payment confirmation."
                  displayIcon = Clock
                  displayColor = "text-yellow-500"
                  break
                case "failed":
                  displayMessage = "Your order payment failed."
                  displayIcon = XCircle
                  displayColor = "text-red-500"
                  break
                case "cancelled":
                  displayMessage = "Your order was cancelled."
                  displayIcon = XCircle
                  displayColor = "text-red-500"
                  break
                default:
                  displayMessage = "Your payment status is unknown."
                  displayIcon = Clock
                  displayColor = "text-gray-500"
              }
          }
        } else {
          // If no transaction record yet, rely on order status
          switch (order.status) {
            case "completed":
              displayMessage = "Your order has been completed."
              displayIcon = CheckCircle
              displayColor = "text-green-500"
              break
            case "pending":
              displayMessage = "Your order is pending payment confirmation."
              displayIcon = Clock
              displayColor = "text-yellow-500"
              break
            case "failed":
              displayMessage = "Your order payment failed."
              displayIcon = XCircle
              displayColor = "text-red-500"
              break
            case "cancelled":
              displayMessage = "Your order was cancelled."
              displayIcon = XCircle
              displayColor = "text-red-500"
              break
            default:
              displayMessage = "Your payment status is unknown."
              displayIcon = Clock
              displayColor = "text-gray-500"
          }
        }

        setOrderStatus({
          status: displayStatus,
          message: displayMessage,
          icon: displayIcon,
          color: displayColor,
        })
      } catch (err) {
        console.error("Unexpected error fetching order status:", err)
        setError("An unexpected error occurred while fetching order details.")
        setOrderStatus({
          status: "error",
          message: "An unexpected error occurred.",
          icon: XCircle,
          color: "text-red-500",
        })
      } finally {
        setLoading(false)
      }
    }

    if (mPaymentId) {
      fetchOrderStatus(mPaymentId)
    } else {
      setLoading(false)
      setError("No payment ID found in the URL.")
      setOrderStatus({
        status: "error",
        message: "Payment details not found.",
        icon: XCircle,
        color: "text-red-500",
      })
    }
  }, [searchParams])

  const IconComponent = orderStatus?.icon || Clock

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            {loading ? (
              <>
                <Clock className="mx-auto h-16 w-16 animate-spin text-gray-400" />
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Processing your payment...</h2>
                <p className="mt-2 text-sm text-gray-600">Please wait while we confirm your transaction.</p>
              </>
            ) : error ? (
              <>
                <XCircle className="mx-auto h-16 w-16 text-red-500" />
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Payment Error</h2>
                <p className="mt-2 text-sm text-red-600">{error}</p>
              </>
            ) : (
              orderStatus && (
                <>
                  <IconComponent className={`mx-auto h-16 w-16 ${orderStatus.color}`} />
                  <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                    {orderStatus.status === "completed"
                      ? "Payment Successful!"
                      : orderStatus.status === "failed"
                        ? "Payment Failed"
                        : orderStatus.status === "cancelled"
                          ? "Payment Cancelled"
                          : "Payment Status"}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">{orderStatus.message}</p>
                </>
              )
            )}
          </div>
          {!loading && (
            <div className="mt-6">
              <Button onClick={() => router.push("/account")} className="w-full">
                View My Orders
              </Button>
              <Button variant="outline" onClick={() => router.push("/")} className="mt-3 w-full">
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
