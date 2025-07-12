import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTable } from "@/components/admin/users-table"
import { OrdersTable } from "@/components/admin/orders-table"
import { CustomQuotesTable } from "@/components/admin/custom-quotes-table"

export default async function AdminDashboardPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.role !== "admin") {
    redirect("/") // Redirect non-admin users
  }

  // Fetch data for the dashboard
  const [usersRes, ordersRes, customQuotesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/users`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/orders`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/custom-quotes`, { cache: "no-store" }),
  ])

  const users = usersRes.ok ? await usersRes.json() : []
  const orders = ordersRes.ok ? await ordersRes.json() : []
  const customQuotes = customQuotesRes.ok ? await customQuotesRes.json() : []

  return (
    <main className="flex min-h-[calc(100vh-theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <UsersTable users={users} />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTable orders={orders} />
          </TabsContent>
          <TabsContent value="quotes">
            <CustomQuotesTable customQuotes={customQuotes} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
