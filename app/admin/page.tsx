"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { UsersTable } from "@/components/admin/users-table"
import { OrdersTable } from "@/components/admin/orders-table"
import { CustomQuotesTable } from "@/components/admin/custom-quotes-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboardPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login") // Redirect to login if not authenticated or not admin
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="custom-quotes">Custom Quotes</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UsersTable />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>
        <TabsContent value="custom-quotes">
          <CustomQuotesTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
