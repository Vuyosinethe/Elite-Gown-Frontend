import Layout from "@/components/layout"
import { Clock } from "lucide-react"

export default function Loading() {
  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <Clock className="mx-auto h-16 w-16 animate-spin text-gray-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Loading...</h2>
            <p className="mt-2 text-sm text-gray-600">Please wait.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
