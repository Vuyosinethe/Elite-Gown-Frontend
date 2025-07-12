import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { UsersTable } from "@/components/admin/users-table"
import { OrdersTable } from "@/components/admin/orders-table"
import { CustomQuotesTable } from "@/components/admin/custom-quotes-table"

export default async function AdminDashboardPage() {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if the user is an admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.role !== "admin") {
    // Redirect non-admin users to their account page
    redirect("/account")
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-8">
        <UsersTable />
        <OrdersTable />
        <CustomQuotesTable />
      </div>
    </div>
  )
}
