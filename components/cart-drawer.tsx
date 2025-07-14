"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2, MinusCircle, PlusCircle, Trash2 } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { user } = useAuth()
  const {
    cartItems,
    cartCount,
    cartTotal, // cents
    loading,
    error,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCartItems,
  } = useCart()

  const router = useRouter()
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    await updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = async (itemId: number) => {
    await removeFromCart(itemId)
  }

  const handleClearCart = async () => {
    await clearCart()
  }

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login")
      onClose()
      return
    }

    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty.")
      return
    }

    setIsProcessingCheckout(true)
    setCheckoutError(null)

    try {
      const itemsForPayFast = cartItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: (item.price / 100).toFixed(2), // rands as string
        product_image: item.product_image || "/placeholder.svg",
      }))

      const response = await fetch("/api/payfast/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount: (cartTotal / 100).toFixed(2), // rands
          userId: user.id,
          cartItems: itemsForPayFast,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to initiate payment.")

      // Build & submit PayFast form
      const form = document.createElement("form")
      form.method = "POST"
      form.action = data.payfastUrl
      Object.entries<string>(data.payfastFields).forEach(([key, value]) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = value
        form.appendChild(input)
      })
      document.body.appendChild(form)
      form.submit()

      // optimistic cart clear
      await clearCart()
      onClose()
    } catch (err: any) {
      console.error("Checkout error:", err)
      setCheckoutError(err.message || "An error occurred during checkout. Please try again.")
      setIsProcessingCheckout(false)
    }
  }

  if (!isOpen) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col w-full max-w-md bg-white">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Your Cart ({cartCount})</SheetTitle>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto py-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : cartItems.length === 0 ? (
            <div className="text-center text-gray-500">Your cart is empty.</div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.product_image || "/placeholder.svg"}
                    alt={item.product_name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product_name}</h3>
                    <p className="text-sm text-gray-500">R{((item.price * item.quantity) / 100).toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        <SheetFooter className="flex flex-col gap-2 p-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>R{(cartTotal / 100).toFixed(2)}</span>
          </div>

          {checkoutError && <p className="text-red-500 text-sm text-center">{checkoutError}</p>}

          <Button className="w-full" onClick={handleCheckout} disabled={isProcessingCheckout || cartItems.length === 0}>
            {isProcessingCheckout ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </Button>

          <Button variant="outline" className="w-full bg-transparent" onClick={onClose}>
            Continue Shopping
          </Button>

          {cartItems.length > 0 && (
            <Button variant="ghost" className="w-full text-red-500 hover:text-red-600" onClick={handleClearCart}>
              Clear Cart
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
