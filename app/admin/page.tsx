"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTable } from "@/components/admin/users-table"
import { OrdersTable } from "@/components/admin/orders-table"
import { CustomQuotesTable } from "@/components/admin/custom-quotes-table"
import Layout from "@/components/layout"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("users")

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login?message=You must be logged in as an admin to access this page.")
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading admin dashboard...</p>
        </div>
      </Layout>
    )
  }

  if (!user || !isAdmin) {
    // This state should ideally be brief as the useEffect redirects quickly
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Redirecting...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="quotes">Custom Quotes</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <UsersTable />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTable />
          </TabsContent>
          <TabsContent value="quotes">
            <CustomQuotesTable />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
