"use client"

import { Separator } from "@/components/ui/separator"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, UserIcon, ShoppingBag, Heart, LogOut, Edit } from "lucide-react"
import Layout from "@/components/layout"

interface Order {
  id: string
  created_at: string
  total_amount: number
  status: string
  order_items: {
    product_name: string
    quantity: number
    price: number
  }[]
}

export default function AccountPage() {
  const { user, profile, signOut, loading: authLoading, updateProfile } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false)
  const [profileUpdateError, setProfileUpdateError] = useState<string | null>(null)
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState<string | null>(null)

  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "")
      setLastName(profile.last_name || "")
      setPhone(profile.phone || "")
      setAvatarUrl(profile.avatar_url || "")
    }
  }, [profile])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      setOrdersLoading(true)
      setOrdersError(null)
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            id,
            created_at,
            total_amount,
            status,
            order_items (
              product_name,
              quantity,
              price
            )
          `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setOrders(data || [])
      } catch (err: any) {
        console.error("Error fetching orders:", err.message)
        setOrdersError("Failed to load orders. Please try again.")
      } finally {
        setOrdersLoading(false)
      }
    }

    if (user && activeTab === "orders") {
      fetchOrders()
    }
  }, [user, activeTab])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileUpdateLoading(true)
    setProfileUpdateError(null)
    setProfileUpdateSuccess(null)

    const { error } = await updateProfile({ firstName, lastName, phone, avatar: avatarUrl })

    if (error) {
      setProfileUpdateError(error.message || "Failed to update profile.")
      setProfileUpdateSuccess(null)
    } else {
      setProfileUpdateSuccess("Profile updated successfully!")
      setProfileUpdateError(null)
      setIsEditingProfile(false) // Exit edit mode on success
    }
    setProfileUpdateLoading(false)
  }

  if (authLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null // Should redirect to login via useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">My Account</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="profile">
              <UserIcon className="mr-2 h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="mr-2 h-4 w-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              <Heart className="mr-2 h-4 w-4" /> Wishlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
                {!isEditingProfile && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {profileUpdateSuccess && (
                  <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">{profileUpdateSuccess}</div>
                )}
                {profileUpdateError && (
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{profileUpdateError}</div>
                )}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarUrl || "/placeholder-user.jpg"} alt={user.firstName || "User"} />
                    <AvatarFallback>{user.firstName ? user.firstName[0] : "U"}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-lg font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={!isEditingProfile || profileUpdateLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={!isEditingProfile || profileUpdateLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditingProfile || profileUpdateLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input
                      id="avatarUrl"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      disabled={!isEditingProfile || profileUpdateLoading}
                    />
                  </div>
                  {isEditingProfile && (
                    <div className="flex gap-2">
                      <Button type="submit" disabled={profileUpdateLoading}>
                        {profileUpdateLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingProfile(false)}
                        disabled={profileUpdateLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
                <Separator />
                <Button variant="destructive" onClick={signOut} className="w-full">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
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
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : ordersError ? (
                  <div className="text-center text-red-600">{ordersError}</div>
                ) : orders.length === 0 ? (
                  <div className="text-center text-gray-500">You have no orders yet.</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Order #{order.id.substring(0, 8)}</p>
                            <p className="text-sm text-gray-500">
                              Date: {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">R{order.total_amount.toFixed(2)}</p>
                            <p
                              className={`text-sm font-medium ${
                                order.status === "completed" ? "text-green-600" : "text-yellow-600"
                              }`}
                            >
                              {order.status.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div className="space-y-2">
                          {order.order_items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-700">
                              <span>
                                {item.product_name} (x{item.quantity})
                              </span>
                              <span>R{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="mt-4 w-full bg-transparent">
                          View Details
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
                <CardDescription>Your saved items for later.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500">Wishlist functionality coming soon!</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
