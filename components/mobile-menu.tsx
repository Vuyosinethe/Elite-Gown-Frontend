"use client"

import { useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { X, ShoppingCart, User, Heart, ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { items, toggleCart } = useCart()
  const [showSaleItems, setShowSaleItems] = useState(false)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleCartClick = () => {
    toggleCart()
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              <Link href="/" className="block text-lg font-medium py-2" onClick={onClose}>
                Home
              </Link>

              <div>
                <button
                  onClick={() => setShowSaleItems(!showSaleItems)}
                  className="flex items-center justify-between w-full text-lg font-medium py-2 text-green-600"
                >
                  Sale
                  {showSaleItems ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </button>

                {showSaleItems && (
                  <div className="ml-4 mt-2 space-y-2 max-h-64 overflow-y-auto">
                    <Link
                      href="/graduation-gowns"
                      className="block py-2 text-sm hover:text-green-600"
                      onClick={onClose}
                    >
                      Graduation Gowns
                    </Link>
                    <Link href="/medical-scrubs" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
                      Medical Scrubs
                    </Link>
                    <Link
                      href="/embroidered-merchandise"
                      className="block py-2 text-sm hover:text-green-600"
                      onClick={onClose}
                    >
                      Embroidered Merchandise
                    </Link>
                    <Link href="/products" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
                      Academic Regalia
                    </Link>
                    <Link href="/products" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
                      Ceremonial Wear
                    </Link>
                    <Link href="/products" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
                      Professional Attire
                    </Link>
                    <Link href="/products" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
                      Custom Embroidery
                    </Link>
                    <Link href="/products" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
                      Accessories
                    </Link>
                    <Link href="/products" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
                      Caps & Tassels
                    </Link>
                    <Link href="/products" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
                      Stoles & Sashes
                    </Link>
                    <Link href="/products" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
                      Honor Cords
                    </Link>
                    <Link href="/products" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
                      Medals & Awards
                    </Link>
                    <Link href="/rental" className="block py-2 text-sm hover:text-green-600" onClick={onClose}>
                      Rental Services
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/about" className="block text-lg font-medium py-2" onClick={onClose}>
                About
              </Link>

              <Link href="/contact" className="block text-lg font-medium py-2" onClick={onClose}>
                Contact
              </Link>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="border-t p-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/account" onClick={onClose}>
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Link>
              </Button>

              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/login" onClick={onClose}>
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start relative bg-transparent"
                onClick={handleCartClick}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {itemCount > 0 && (
                  <span className="absolute right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
