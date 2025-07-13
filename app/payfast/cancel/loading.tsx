import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
    </div>
  )
}
