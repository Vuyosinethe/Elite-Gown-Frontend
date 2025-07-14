"use client"

import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PayFastCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Payment Cancelled</h2>
        <p className="mt-2 text-sm text-gray-600">Your payment was cancelled. No charges have been made.</p>
        <div className="mt-6 space-y-3">
          <Link href="/cart" className="block">
            <Button className="w-full">Return to Cart</Button>
          </Link>
          <Link href="/products" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
