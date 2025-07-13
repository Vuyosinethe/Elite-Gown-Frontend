import { Loader2 } from "lucide-react"
import Layout from "@/components/layout"

export default function Loading() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center bg-white p-8 rounded-lg shadow-lg">
          <Loader2 className="h-12 w-12 text-yellow-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Loading payment status...</h2>
          <p className="mt-2 text-gray-600">Please wait while we confirm your transaction.</p>
        </div>
      </div>
    </Layout>
  )
}
