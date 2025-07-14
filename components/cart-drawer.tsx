"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function CartDrawer() {
  const { cartItems, cartTotal, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?redirect=/cart") // Redirect to login if not authenticated
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch("/api/payfast/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price / 100, // Convert cents to Rands for PayFast
            image: item.image,
          })),
          userId: user.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create PayFast session")
      }

      const { payfastUrl, payfastFields } = data as {
        payfastUrl: string
        payfastFields?: Record<string, string | number>
      }

      // If the API returned form fields, build a hidden form and POST it (required by PayFast)
      if (payfastFields && Object.keys(payfastFields).length > 0) {
        const form = document.createElement("form")
        form.method = "POST"
        form.action = payfastUrl
        form.target = "_self" // Open in the same tab

        for (const key in payfastFields) {
          if (Object.prototype.hasOwnProperty.call(payfastFields, key)) {
            const input = document.createElement("input")
            input.type = "hidden"
            input.name = key
            input.value = String(payfastFields[key])
            form.appendChild(input)
          }
        }

        document.body.appendChild(form)
        form.submit()
        clearCart() // Clear cart optimistically
        setIsSheetOpen(false) // Close the cart drawer
      } else {
        // Fallback: if no fields, redirect directly (though PayFast usually requires POST)
        window.location.href = payfastUrl
        clearCart() // Clear cart optimistically
        setIsSheetOpen(false) // Close the cart drawer
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("There was an error processing your checkout. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-6 w-6" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {cartItems.length}
            </span>
          )}
          <span className="sr-only">View cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({cartItems.length})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">Your cart is empty.</div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    <p className="text-sm font-semibold">R{(item.price / 100).toFixed(2)}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <Separator className="mt-auto" />
        <div className="flex items-center justify-between py-4 font-semibold">
          <span>Total:</span>
          <span>R{cartTotal.toFixed(2)}</span>
        </div>
        <Button onClick={handleCheckout} disabled={cartItems.length === 0 || isProcessing}>
          {isProcessing ? "Processing..." : "Proceed to Checkout"}
        </Button>
        <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
          Continue Shopping
        </Button>
      </SheetContent>
    </Sheet>
  )
}
