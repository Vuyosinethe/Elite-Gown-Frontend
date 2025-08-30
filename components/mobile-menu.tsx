"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"
import { ShoppingCart, User, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart-drawer"

export function MobileMenu() {
  const { user } = useAuth()
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="flex flex-col space-y-4 p-4">
      <Link href="/" className="text-lg font-medium">
        Home
      </Link>
      <Link href="/products" className="text-lg font-medium">
        Products
      </Link>
      <Link href="/graduation-gowns" className="text-lg font-medium">
        Graduation Gowns
      </Link>
      <Link href="/medical-scrubs" className="text-lg font-medium">
        Medical Scrubs
      </Link>
      <Link href="/embroidered-merchandise" className="text-lg font-medium">
        Embroidered Merchandise
      </Link>
      <Link href="/rental" className="text-lg font-medium">
        Rental
      </Link>
      <Link href="/about" className="text-lg font-medium">
        About
      </Link>
      <Link href="/contact" className="text-lg font-medium">
        Contact
      </Link>

      <div className="border-t pt-4 mt-4">
        <div className="flex items-center space-x-4">
          {/* User Account */}
          {user ? (
            <Link href="/account">
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
                <span className="ml-2">Account</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
                <span className="ml-2">Login</span>
              </Button>
            </Link>
          )}

          {/* Wishlist */}
          <Link href="/wishlist">
            <Button variant="ghost" size="sm">
              <Heart className="h-5 w-5" />
              <span className="ml-2">Wishlist</span>
            </Button>
          </Link>

          {/* Cart */}
          <CartDrawer>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="ml-2">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </CartDrawer>
        </div>
      </div>
    </div>
  )
}
