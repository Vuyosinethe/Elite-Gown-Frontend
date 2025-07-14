"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Minus, Plus, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { createCheckoutSession } from "@/lib/payfast"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, updateCartItemQuantity, removeCartItem, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateCartItemQuantity(itemId, newQuantity)
    } else {
      removeCartItem(itemId)
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/checkout")
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
      const checkoutUrl = await createCheckoutSession(cartItems, user.id)
      if (checkoutUrl) {
        window.location.href = checkoutUrl // Redirect to PayFast
      } else {
        alert("Failed to initiate checkout. Please try again.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("An error occurred during checkout. Please try again.")
    } finally {
      setIsProcessingCheckout(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[400px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Your Cart ({cartItems.length})
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart className="h-16 w-16 mb-4" />
              <p className="text-lg">Your cart is empty.</p>
              <Button variant="link" onClick={onClose} className="mt-4">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value))}
                        className="w-14 text-center mx-2 h-7"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeCartItem(item.id)}>
                    <X className="h-5 w-5 text-gray-400 hover:text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-medium mb-4">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <Button className="w-full" onClick={handleCheckout} disabled={isProcessingCheckout}>
              {isProcessingCheckout ? "Processing..." : "Proceed to Checkout"}
            </Button>
            <Button variant="outline" className="w-full mt-2 bg-transparent" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
