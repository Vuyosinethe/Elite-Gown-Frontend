"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { Loader2, Package, CreditCard, CalendarDays } from "lucide-react"

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  order_items: Array<{
    product_name: string
    quantity: number
    price: number
  }>
  transactions: Array<{
    status: string
    payment_status: string | null
    amount_gross: number
  }> | null
}

export default function AccountPage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      // If not loading and no user, redirect to login
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoadingOrders(false)
        return
      }

      setLoadingOrders(true)
      setOrdersError(null)
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            id,
            total_amount,
            status,
            created_at,
            order_items (
              product_name,
              quantity,
              price
            ),
            transactions (
              status,
              payment_status,
              amount_gross
            )
          `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching orders:", error)
          setOrdersError(`Error fetching orders: ${error.message}`)
          setOrders([])
        } else {
          setOrders(data || [])
        }
      } catch (err) {
        console.error("Unexpected error fetching orders:", err)
        setOrdersError("An unexpected error occurred while fetching your orders.")
        setOrders([])
      } finally {
        setLoadingOrders(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  if (authLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        </div>
      </Layout>
    )
  }

  if (!user) {
    // This case should be handled by the useEffect redirect, but as a fallback
    return null
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold">My Account</h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Profile Information */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                <span className="font-semibold">Name:</span> {user.firstName} {user.lastName}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              {user.phone && (
                <p className="mb-2">
                  <span className="font-semibold">Phone:</span> {user.phone}
                </p>
              )}
              <Button onClick={() => alert("Edit profile functionality coming soon!")} className="mt-4 w-full">
                Edit Profile
              </Button>
              <Button onClick={signOut} variant="outline" className="mt-2 w-full bg-transparent">
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : ordersError ? (
                <div className="text-center text-red-500">{ordersError}</div>
              ) : orders.length === 0 ? (
                <p className="text-center text-gray-500">You have no orders yet.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-lg border p-4 shadow-sm">
                      <div className="mb-4 flex flex-col justify-between md:flex-row md:items-center">
                        <h3 className="text-lg font-semibold">Order #{order.id.substring(0, 8)}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarDays className="mr-1 h-4 w-4" />
                          <span>{format(new Date(order.created_at), "PPP")}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div className="flex items-center">
                          <Package className="mr-2 h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium capitalize">{order.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Payment</p>
                            <p className="font-medium capitalize">
                              {order.transactions && order.transactions.length > 0
                                ? order.transactions[0].payment_status?.toLowerCase() || "N/A"
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-medium">R{(order.total_amount / 100).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 border-t pt-4">
                        <h4 className="mb-2 text-md font-semibold">Items:</h4>
                        <ul className="space-y-2">
                          {order.order_items.map((item, index) => (
                            <li key={index} className="flex items-center">
                              <span className="text-sm">
                                {item.product_name} (x{item.quantity}) - R{(item.price / 100).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button variant="outline" className="mt-4 w-full bg-transparent">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
