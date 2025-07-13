import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Loading...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 p-6">
          <Loader2 className="h-20 w-20 text-blue-500 animate-spin" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Please wait...</p>
        </CardContent>
      </Card>
    </div>
  )
}
