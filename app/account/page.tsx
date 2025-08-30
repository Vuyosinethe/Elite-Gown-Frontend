"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { User, Settings, Heart, Package, Edit3, LogOut } from "lucide-react"
import Layout from "@/components/layout"
import { AuthGuard } from "@/components/auth-guard"

export default function AccountPage() {
  const { user, loading, signOut, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState("")

  // Initialize edit form when user data is available
  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  const handleSignOut = async () => {
    await signOut()
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateMessage("")

    try {
      const { error } = await updateProfile({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone,
      })

      if (error) {
        setUpdateMessage(`Error: ${error.message}`)
      } else {
        setUpdateMessage("Profile updated successfully!")
        setIsEditing(false)
        setTimeout(() => setUpdateMessage(""), 3000)
      }
    } catch (error) {
      setUpdateMessage("Failed to update profile. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <AuthGuard requireAuth={true}>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Saved Items</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Orders</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Profile Information
                      {!isEditing && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {updateMessage && (
                      <div
                        className={`mb-4 p-3 rounded-md ${
                          updateMessage.includes("Error")
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                        }`}
                      >
                        {updateMessage}
                      </div>
                    )}

                    {isEditing ? (
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              type="text"
                              value={editForm.firstName}
                              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                              disabled={isUpdating}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              type="text"
                              value={editForm.lastName}
                              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                              disabled={isUpdating}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            disabled={isUpdating}
                          />
                        </div>
                        <div className="flex space-x-3">
                          <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? "Updating..." : "Save Changes"}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">First Name</Label>
                            <p className="mt-1 text-sm text-gray-900">{user?.firstName || "Not provided"}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                            <p className="mt-1 text-sm text-gray-900">{user?.lastName || "Not provided"}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Email</Label>
                          <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                          {!user?.emailConfirmed && <p className="mt-1 text-sm text-amber-600">⚠️ Email not verified</p>}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                          <p className="mt-1 text-sm text-gray-900">{user?.phone || "Not provided"}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Items</CardTitle>
                    <CardDescription>Items you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No saved items yet</p>
                      <p className="text-sm text-gray-400 mt-2">Items you save will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View your past orders and their status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No orders yet</p>
                      <p className="text-sm text-gray-400 mt-2">Your order history will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive updates about your orders and account</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-gray-500">Change your account password</p>
                      </div>
                      <Link href="/reset-password">
                        <Button variant="outline" size="sm">
                          Change
                        </Button>
                      </Link>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                      <div>
                        <h3 className="font-medium text-red-600">Sign Out</h3>
                        <p className="text-sm text-gray-500">Sign out of your account</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSignOut}
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}
