"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { cartItems, cartCount, subtotal, vat, total, updateQuantity, removeFromCart, clearCart, loading } = useCart()

  const handleSignInClick = () => {
    onClose()
    router.push("/login")
  }

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    await updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = async (itemId: number) => {
    await removeFromCart(itemId)
  }

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart()
    }
  }

  const handleProceedToCheckout = () => {
    if (!user) {
      // Store current cart for after login
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectAfterLogin", "/checkout")
      }
      router.push("/login")
      return
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before proceeding to checkout.")
      return
    }

    // For now, just show an alert since we're not integrating with backend
    alert("Checkout functionality will be implemented with backend integration. For now, this is a frontend-only cart.")
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={onClose} />

      {/* Cart Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <p className="text-sm text-gray-600">{loading ? "Loading..." : `${cartCount} items`}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {cartItems.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearCart} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : cartItems.length === 0 ? (
              // Empty cart state
              <div className="text-center py-12">
                <div className="bg-gray-100 text-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some items to get started</p>
                <Button className="bg-black hover:bg-gray-800 text-white" onClick={onClose}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              // Cart with items
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.product_image || "/placeholder.svg"}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 text-sm leading-tight">{item.product_name}</h3>
                              <p className="text-xs text-gray-600 mt-1">{item.product_details}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 p-1"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-7 h-7 p-0 bg-transparent"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-7 h-7 p-0 bg-transparent"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="font-semibold text-sm">R {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer - only show if has items */}
          {cartItems.length > 0 && !loading && (
            <div className="border-t p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>VAT (15%)</span>
                  <span>R {vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>R {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-black hover:bg-gray-800 text-white" onClick={handleProceedToCheckout}>
                {!user ? "Sign In to Checkout" : "Proceed to Checkout"}
              </Button>

              <div className="text-center">
                <Button variant="ghost" className="text-sm text-gray-600 hover:text-black" onClick={onClose}>
                  Continue Shopping
                </Button>
              </div>

              {/* Payment Methods */}
              <div className="text-center pt-4 border-t">
                <p className="text-xs text-gray-600 mb-2">We accept:</p>
                <div className="flex justify-center space-x-2">
                  <div className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">VISA</div>
                  <div className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">MasterCard</div>
                  <div className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">EFT</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
