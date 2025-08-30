"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, User, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartDrawer } from "@/components/cart-drawer"
import { MobileMenu } from "@/components/mobile-menu"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/auth-context"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { items } = useCart()
  const { user, signOut } = useAuth()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <div className="flex items-center gap-4 md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80">
              Home
            </Link>
            <div className="relative group">
              <button className="flex items-center space-x-1 transition-colors hover:text-green-600">
                <span>Sale</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-2">
                    <Link
                      href="/graduation-gowns"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Graduation Gowns
                    </Link>
                    <Link
                      href="/medical-scrubs"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Medical Scrubs
                    </Link>
                    <Link
                      href="/embroidered-merchandise"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Embroidered Merchandise
                    </Link>
                    <Link
                      href="/products?category=caps"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Graduation Caps
                    </Link>
                    <Link
                      href="/products?category=accessories"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Academic Accessories
                    </Link>
                    <Link
                      href="/products?category=stoles"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Honor Stoles
                    </Link>
                    <Link
                      href="/products?category=tassels"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Graduation Tassels
                    </Link>
                    <Link
                      href="/products?category=hoods"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Academic Hoods
                    </Link>
                    <Link
                      href="/products?category=lab-coats"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Lab Coats
                    </Link>
                    <Link
                      href="/products?category=nursing"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Nursing Uniforms
                    </Link>
                    <Link
                      href="/products?category=surgical"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Surgical Scrubs
                    </Link>
                    <Link
                      href="/products?category=pediatric"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Pediatric Scrubs
                    </Link>
                    <Link
                      href="/products?category=maternity"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Maternity Scrubs
                    </Link>
                    <Link
                      href="/products?category=shoes"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Medical Shoes
                    </Link>
                    <Link
                      href="/products?category=bags"
                      className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                    >
                      Medical Bags
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/about" className="transition-colors hover:text-foreground/80">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground/80">
              Contact
            </Link>
          </nav>

          {/* Logo - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/elite-gowns-logo.png" alt="Elite Gowns" width={120} height={40} className="h-8 w-auto" />
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-black text-white">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <Link
                      href="/account"
                      className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Image src="/elite-gowns-logo.png" alt="Elite Gowns" width={120} height={40} className="h-8 w-auto" />
              <p className="text-sm text-muted-foreground">
                Premium graduation gowns and medical scrubs for professionals and students.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Products</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/graduation-gowns" className="text-muted-foreground hover:text-foreground">
                    Graduation Gowns
                  </Link>
                </li>
                <li>
                  <Link href="/medical-scrubs" className="text-muted-foreground hover:text-foreground">
                    Medical Scrubs
                  </Link>
                </li>
                <li>
                  <Link href="/embroidered-merchandise" className="text-muted-foreground hover:text-foreground">
                    Embroidered Items
                  </Link>
                </li>
                <li>
                  <Link href="/rental" className="text-muted-foreground hover:text-foreground">
                    Rental Services
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/size-guide" className="text-muted-foreground hover:text-foreground">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-muted-foreground hover:text-foreground">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Elite Gowns. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
