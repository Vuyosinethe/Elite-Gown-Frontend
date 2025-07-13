import { XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PayFastCancelPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 p-6">
          <XCircle className="h-20 w-20 text-red-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Your payment was cancelled. No charges have been made.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
