"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"

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
      // keep intended destination
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
      const res = await fetch("/api/payfast/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, userId: user.id }),
      })

      if (!res.ok) throw new Error((await res.json()).error || "Payment init failed")

      const { url, fields } = await res.json()

      // dynamically build a form & post to PayFast
      const form = document.createElement("form")
      form.method = "POST"
      form.action = url

      fields.forEach((f: { name: string; value: string }) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = f.name
        input.value = f.value
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()

      clearCart()
      onClose()
    } catch (err: any) {
      console.error("Checkout error", err)
      alert(`Checkout failed: ${err.message}`)
    } finally {
      setIsProcessingCheckout(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Your Cart ({cartCount})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-gray-500">
            <Image src="/placeholder.svg" alt="Empty cart" width={100} height={100} className="mb-2" />
            <p className="text-lg">Your cart is empty.</p>
            <Button onClick={onClose}>Continue Shopping</Button>
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
                    <div className="grid flex-1 gap-1">
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
            <div className="flex items-center justify-between text-lg font-medium">
              <span>Total:</span>
              <span>R {(total / 100).toFixed(2)}</span>
            </div>

            <Button onClick={handleCheckout} disabled={isProcessingCheckout} className="mt-4 w-full">
              {isProcessingCheckout ? "Processing…" : "Proceed to Checkout"}
            </Button>
            <Button variant="outline" onClick={onClose} className="mt-2 w-full bg-transparent">
              Continue Shopping
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
