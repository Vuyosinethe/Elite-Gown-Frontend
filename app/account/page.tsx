"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Layout from "@/components/layout"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  payfast_order_id: string | null
}

export default function AccountPage() {
  const { user, profile, signOut, updateProfile, loading: authLoading } = useAuth()
  const router = useRouter()

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [avatar, setAvatar] = useState(user?.avatar || "")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileUpdateMessage, setProfileUpdateMessage] = useState("")
  const [profileUpdateError, setProfileUpdateError] = useState("")

  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setPhone(user.phone || "")
      setAvatar(user.avatar || "")
    }
  }, [user])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setOrdersLoading(false)
        return
      }

      setOrdersLoading(true)
      setOrdersError(null)
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("id, total_amount, status, created_at, payfast_order_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching orders:", error)
          setOrdersError("Failed to load orders.")
        } else {
          setOrders(data || [])
        }
      } catch (err) {
        console.error("Unexpected error fetching orders:", err)
        setOrdersError("An unexpected error occurred while loading orders.")
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)
    setProfileUpdateMessage("")
    setProfileUpdateError("")

    const { error } = await updateProfile({ firstName, lastName, phone, avatar })

    if (error) {
      setProfileUpdateError(error.message || "Failed to update profile.")
    } else {
      setProfileUpdateMessage("Profile updated successfully!")
    }
    setIsUpdatingProfile(false)
  }

  if (authLoading || !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Loading account...</span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            {profile?.role === "admin" && <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
              </CardHeader>
              <CardContent>
                {profileUpdateMessage && <div className="mb-4 text-green-600">{profileUpdateMessage}</div>}
                {profileUpdateError && <div className="mb-4 text-red-600">{profileUpdateError}</div>}
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isUpdatingProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isUpdatingProfile}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isUpdatingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                      id="avatar"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      disabled={isUpdatingProfile}
                    />
                  </div>
                  <Button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>View your past orders and their statuses.</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                    <span className="ml-2 text-gray-600">Loading orders...</span>
                  </div>
                ) : ordersError ? (
                  <div className="text-red-600">{ordersError}</div>
                ) : orders.length === 0 ? (
                  <p>You have no orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">Order #{order.id.substring(0, 8)}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Total: R{order.total_amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                        {order.payfast_order_id && (
                          <p className="text-sm text-gray-600">PayFast ID: {order.payfast_order_id.substring(0, 8)}</p>
                        )}
                        <Button variant="link" className="p-0 h-auto mt-2">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {profile?.role === "admin" && (
            <TabsContent value="admin" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Dashboard</CardTitle>
                  <CardDescription>Access administrative functions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Welcome, Admin! More features coming soon.</p>
                  {/* Add admin specific content here */}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={signOut} variant="destructive">
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
