"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTable } from "@/components/admin/users-table"
import { OrdersTable } from "@/components/admin/orders-table"
import { CustomQuotesTable } from "@/components/admin/custom-quotes-table"

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login?message=You are not authorized to view this page.")
    }
  }, [user, loading, isAdmin, router])

  if (loading || (!user && !loading)) {
    return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>
  }

  if (!isAdmin) {
    return null // Redirect handled by useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
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
