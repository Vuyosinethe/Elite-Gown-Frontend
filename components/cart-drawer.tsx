"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, X } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/auth-context" // Assuming you have an AuthContext

export default function CartDrawer() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart()
  const { user } = useAuth() // Get user from AuthContext
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to proceed to checkout.")
      // Optionally redirect to login page
      // router.push('/login');
      return
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.")
      return
    }

    try {
      // Generate a unique order ID
      const orderId = uuidv4()

      // Prepare data for the API route
      const checkoutData = {
        cartItems: cartItems.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price, // Price is already in cents from useCart
          product_image: item.image,
        })),
        userId: user.id,
        totalAmount: cartTotal, // Total amount in cents
      }

      const res = await fetch("/api/payfast/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("Checkout API error:", data.error)
        alert(`Checkout failed: ${data.error}`)
        return
      }

      const { payfastUrl, payfastFields } = data

      // Dynamically create and submit the form to PayFast
      if (payfastUrl && payfastFields) {
        const form = document.createElement("form")
        form.method = "POST"
        form.action = payfastUrl
        form.target = "_self" // Open in the same tab

        for (const key in payfastFields) {
          if (Object.prototype.hasOwnProperty.call(payfastFields, key)) {
            const input = document.createElement("input")
            input.type = "hidden"
            input.name = key
            input.value = payfastFields[key]
            form.appendChild(input)
          }
        }

        document.body.appendChild(form)
        form.submit()
      } else {
        alert("Failed to get PayFast details. Please try again.")
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      alert("An unexpected error occurred during checkout.")
    }
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-6 w-6" />
          {cartItems.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {cartItems.length}
            </span>
          )}
          <span className="sr-only">View cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart ({cartItems.length})</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-6">
          {cartItems.length === 0 ? (
            <p className="text-center text-muted-foreground">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">R{(item.price / 100).toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </Button>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Separator />
        <SheetFooter className="flex flex-col gap-2 pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>R{(cartTotal / 100).toFixed(2)}</span>
          </div>
          <Button className="w-full" onClick={handleCheckout} disabled={cartItems.length === 0}>
            Proceed to Checkout
          </Button>
          <Link href="/products" passHref>
            <Button variant="outline" className="w-full bg-transparent">
              Continue Shopping
            </Button>
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
