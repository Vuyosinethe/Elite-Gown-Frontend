"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { UsersTable } from "@/components/admin/users-table"
import { OrdersTable } from "@/components/admin/orders-table"
import { CustomQuotesTable } from "@/components/admin/custom-quotes-table"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/layout" // Assuming Layout is exported from components/layout

export default function AdminDashboardPage() {
  const { user, loading, isAdmin, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      // If not loading, and no user or not admin, redirect to login
      router.push("/login")
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading dashboard...</p>
        </div>
      </Layout>
    )
  }

  if (!user || !isAdmin) {
    // This state should ideally be prevented by the useEffect redirect
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <p>Access Denied. Redirecting...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6">
          <UsersTable />
          <OrdersTable />
          <CustomQuotesTable />
        </div>
      </div>
    </Layout>
  )
}
