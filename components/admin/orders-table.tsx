"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price: number
  item_total: number
  metadata: any // jsonb
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  updated_at: string
  order_items: OrderItem[]
  user_id: string | null
  guest_id: string | null
  shipping_address: any // jsonb
  billing_address: any // jsonb
}

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/orders")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch orders")
      }
      const data: Order[] = await response.json()
      setOrders(data)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError((err as Error).message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleStatusChange = useCallback(async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update order status")
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
      )
    } catch (err) {
      console.error("Error updating order status:", err)
      alert(`Failed to update order status: ${(err as Error).message}`)
    }
  }, [])

  const handlePaymentStatusChange = useCallback(async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment_status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update payment status")
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, payment_status: newStatus } : order)),
      )
    } catch (err) {
      console.error("Error updating payment status:", err)
      alert(`Failed to update payment status: ${(err as Error).message}`)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Loading orders...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Manage customer orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell>{order.user_id || order.guest_id || "N/A"}</TableCell>
                <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={order.payment_status}
                    onValueChange={(value) => handlePaymentStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{format(new Date(order.created_at), "PPP")}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Order Details: {order.order_number}</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="grid gap-4 py-4 text-sm">
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">Order ID:</span>
                            <span>{order.id}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">User ID:</span>
                            <span>{order.user_id || order.guest_id || "N/A"}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">Total Amount:</span>
                            <span>${order.total_amount.toFixed(2)}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">Order Status:</span>
                            <span>{order.status}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">Payment Status:</span>
                            <span>{order.payment_status}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">Created At:</span>
                            <span>{format(new Date(order.created_at), "PPP p")}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">Last Updated:</span>
                            <span>{format(new Date(order.updated_at), "PPP p")}</span>
                          </div>

                          {order.shipping_address && (
                            <>
                              <h4 className="font-semibold mt-4 col-span-2">Shipping Address</h4>
                              <div className="grid grid-cols-2 gap-1">
                                <span className="font-medium">Name:</span>
                                <span>{order.shipping_address.name}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                <span className="font-medium">Address:</span>
                                <span>
                                  {order.shipping_address.street}, {order.shipping_address.city},{" "}
                                  {order.shipping_address.state} {order.shipping_address.zip}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                <span className="font-medium">Country:</span>
                                <span>{order.shipping_address.country}</span>
                              </div>
                            </>
                          )}

                          {order.billing_address && (
                            <>
                              <h4 className="font-semibold mt-4 col-span-2">Billing Address</h4>
                              <div className="grid grid-cols-2 gap-1">
                                <span className="font-medium">Name:</span>
                                <span>{order.billing_address.name}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                <span className="font-medium">Address:</span>
                                <span>
                                  {order.billing_address.street}, {order.billing_address.city},{" "}
                                  {order.billing_address.state} {order.billing_address.zip}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                <span className="font-medium">Country:</span>
                                <span>{order.billing_address.country}</span>
                              </div>
                            </>
                          )}

                          <h4 className="font-semibold mt-4 col-span-2">Order Items</h4>
                          {order.order_items && order.order_items.length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Qty</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>Total</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.order_items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{item.product_name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.price.toFixed(2)}</TableCell>
                                    <TableCell>${item.item_total.toFixed(2)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <p>No items found for this order.</p>
                          )}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
