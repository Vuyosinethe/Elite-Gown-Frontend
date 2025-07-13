"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Trash2, MinusCircle, PlusCircle } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { user } = useAuth()
  const { cartItems, cartCount, total, updateQuantity, removeFromCart, clearCart } = useCart()
  const router = useRouter()
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      // Store current path to redirect after login
      localStorage.setItem("redirectAfterLogin", "/checkout") // Or a specific checkout page
      router.push("/login")
      onClose()
      return
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!")
      return
    }

    setIsProcessingCheckout(true)
    try {
      const response = await fetch("/api/payfast/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems, userId: user.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to initiate payment.")
      }

      const { url, fields } = await response.json()

      // Create a form and submit it to PayFast
      const form = document.createElement("form")
      form.method = "POST"
      form.action = url
      form.target = "_self" // Open in the same tab

      fields.forEach((field: { name: string; value: string }) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = field.name
        input.value = field.value
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
      clearCart() // Clear cart after successful redirection to payment gateway
      onClose()
    } catch (error: any) {
      console.error("Checkout failed:", error)
      alert(`Checkout failed: ${error.message}`)
    } finally {
      setIsProcessingCheckout(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[400px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({cartCount})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Image src="/placeholder.svg" alt="Empty cart" width={100} height={100} className="mb-4" />
            <p className="text-lg">Your cart is empty.</p>
            <Button onClick={onClose} className="mt-4">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 py-4">
              <div className="grid gap-4 pr-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1 grid gap-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">R {(item.price ?? 0) / 100}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator className="my-4" />
            <div className="flex justify-between items-center font-medium text-lg">
              <span>Total:</span>
              <span>R {(total / 100).toFixed(2)}</span>
            </div>
            <Button onClick={handleCheckout} className="w-full mt-4" disabled={isProcessingCheckout}>
              {isProcessingCheckout ? "Processing..." : "Proceed to Checkout"}
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full mt-2 bg-transparent">
              Continue Shopping
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
