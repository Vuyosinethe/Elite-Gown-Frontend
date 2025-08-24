"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { User, Package, CreditCard, MapPin, Settings, LogOut, ShoppingBag, Heart, RefreshCw } from "lucide-react"
import { SupabaseSetupGuide } from "@/components/supabase-setup-guide"
import { ProfileDebug } from "@/components/profile-debug"

export default function AccountPage() {
  const { user, signOut, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [refreshing, setRefreshing] = useState(false)

  // If loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  // If no user is logged in, redirect to login
  if (!user) {
    router.push("/login")
    return null
  }

  // Check if we're in mock mode (no Supabase config)
  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  const handleRefreshProfile = async () => {
    setRefreshing(true)
    await refreshProfile()
    setRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                    <Image src="/placeholder-user.jpg" alt="Profile" fill className="object-cover" />
                  </div>
                  <div>
                    <CardTitle>
                      {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : "User"}
                    </CardTitle>
                    <CardDescription className="text-sm truncate max-w-[180px]">{user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col space-y-1">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex items-center px-4 py-2 text-sm ${
                      activeTab === "profile" ? "bg-gray-100 text-black font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`flex items-center px-4 py-2 text-sm ${
                      activeTab === "orders" ? "bg-gray-100 text-black font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Package className="mr-3 h-4 w-4" />
                    Orders
                  </button>
                  <button
                    onClick={() => setActiveTab("saved")}
                    className={`flex items-center px-4 py-2 text-sm ${
                      activeTab === "saved" ? "bg-gray-100 text-black font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Heart className="mr-3 h-4 w-4" />
                    Saved Items
                  </button>
                  <button
                    onClick={() => setActiveTab("addresses")}
                    className={`flex items-center px-4 py-2 text-sm ${
                      activeTab === "addresses"
                        ? "bg-gray-100 text-black font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <MapPin className="mr-3 h-4 w-4" />
                    Addresses
                  </button>
                  <button
                    onClick={() => setActiveTab("payment")}
                    className={`flex items-center px-4 py-2 text-sm ${
                      activeTab === "payment" ? "bg-gray-100 text-black font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <CreditCard className="mr-3 h-4 w-4" />
                    Payment Methods
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex items-center px-4 py-2 text-sm ${
                      activeTab === "settings" ? "bg-gray-100 text-black font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Account Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isMockMode && (
              <div className="mb-6">
                <SupabaseSetupGuide />
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="hidden">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="saved">Saved Items</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Manage your personal information</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefreshProfile}
                        disabled={refreshing}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">First Name</label>
                          <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                            {user.firstName || "Not provided"}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Last Name</label>
                          <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                            {user.lastName || "Not provided"}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">{user.email}</div>
                      </div>
                      <div>
                        <Button variant="outline">Edit Profile</Button>
                      </div>
                    </div>

                    {/* Debug Component - Remove this in production */}
                    <div className="mt-8 pt-8 border-t">
                      <ProfileDebug />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View and track your orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Your order history will appear here.</p>
                      <div className="mt-6">
                        <Link href="/products">
                          <Button>Start Shopping</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saved">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Items</CardTitle>
                    <CardDescription>Products you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Heart className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No saved items</h3>
                      <p className="mt-1 text-sm text-gray-500">Items you save will appear here.</p>
                      <div className="mt-6">
                        <Link href="/products">
                          <Button>Browse Products</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <CardTitle>Addresses</CardTitle>
                    <CardDescription>Manage your shipping and billing addresses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses saved</h3>
                      <p className="mt-1 text-gray-500">Add addresses for faster checkout.</p>
                      <div className="mt-6">
                        <Button variant="outline">Add Address</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No payment methods</h3>
                      <p className="mt-1 text-sm text-gray-500">Add payment methods for faster checkout.</p>
                      <div className="mt-6">
                        <Button variant="outline">Add Payment Method</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Password</h3>
                        <Button variant="outline" size="sm" className="mt-2">
                          Change Password
                        </Button>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Email Preferences</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center">
                            <input
                              id="marketing"
                              name="marketing"
                              type="checkbox"
                              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <label htmlFor="marketing" className="ml-2 block text-sm text-gray-900">
                              Receive marketing emails
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="updates"
                              name="updates"
                              type="checkbox"
                              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="updates" className="ml-2 block text-sm text-gray-900">
                              Receive order updates
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-red-600">Danger Zone</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
