import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { UsersTable } from "@/components/admin/users-table"
import { OrdersTable } from "@/components/admin/orders-table"
import { CustomQuotesTable } from "@/components/admin/custom-quotes-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminDashboardPage() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login") // Redirect to login if not authenticated
  }

  // Server-side check for admin role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.role !== "admin") {
    redirect("/") // Redirect to home or a forbidden page if not admin
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

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
