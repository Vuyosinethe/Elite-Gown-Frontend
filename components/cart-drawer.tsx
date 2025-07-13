'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, X } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/hooks/use-cart'
import { useRouter } from 'next/navigation'

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const { cartItems, removeFromCart, updateQuantity } = useCart()
  const router = useRouter()

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/payfast/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      })

      const data = await response.json()

      if (response.ok) {
        // Construct a form and submit it to PayFast
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.payFastUrl

        for (const key in data.payFastFields) {
          if (data.payFastFields.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input')
            hiddenField.type = 'hidden'
            hiddenField.name = key
            hiddenField.value = data.payFastFields[key]
            form.appendChild(hiddenField)
          }
        }
        document.body.appendChild(form)
        form.submit()
      } else {
        alert(`Checkout failed: ${data.error}`)
        console.error('Checkout failed:', data.error)
      }
    } catch (error) {
      alert('An unexpected error occurred during checkout.')
      console.error('An unexpected error occurred during checkout:', error)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Your Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">Your cart is empty.</div>
        ) : (
          <ScrollArea className="flex-1 py-4">
            <div className="grid gap-6 pr-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="grid flex-1 gap-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        <Separator className="mt-auto" />
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Subtotal:</span>
            <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <Button size="lg" className="w-full" onClick={handleCheckout} disabled={cartItems.length === 0}>
            Proceed to Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
