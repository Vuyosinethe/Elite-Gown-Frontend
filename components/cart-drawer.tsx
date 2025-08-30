"use client"

import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import Link from "next/link"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart()
  const { user } = useAuth()

  if (!isOpen) return null

  const total = getTotal()

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Shopping Cart ({items.length})
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <Button className="mt-4" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                    {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                    <p className="font-semibold text-sm">R{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total: R{total.toFixed(2)}</span>
              <Button variant="outline" size="sm" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>

            {user ? (
              <Button className="w-full" onClick={onClose}>
                Proceed to Checkout
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 text-center">Sign in to checkout</p>
                <Link href="/login" onClick={onClose}>
                  <Button className="w-full">Sign In to Checkout</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
