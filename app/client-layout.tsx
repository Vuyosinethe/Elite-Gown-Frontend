"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, User, Menu, ChevronDown, Search, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/auth-context"
import CartDrawer from "@/components/cart-drawer"
import MobileMenu from "@/components/mobile-menu"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)} className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Logo - Left Side */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/elite-gowns-logo.png" alt="Elite Gowns" width={40} height={40} className="rounded-full" />
                <span className="font-bold text-xl text-orange-500">Elite Gowns</span>
              </Link>
            </div>

            {/* Desktop Navigation - Center */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-black transition-colors">
                Home
              </Link>
              <div className="relative group">
                <button className="text-gray-700 hover:text-green-600 transition-colors flex items-center space-x-1">
                  <span>Shop</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 max-h-80 overflow-y-auto">
                    <div className="space-y-2">
                      <Link
                        href="/graduation-gowns"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                      >
                        Graduation Gowns
                      </Link>
                      <Link
                        href="/medical-scrubs"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                      >
                        Medical Scrubs
                      </Link>
                      <Link
                        href="/embroidered-merchandise"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                      >
                        Embroidered Merchandise
                      </Link>
                      <Link
                        href="/rental"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                      >
                        Rental Services
                      </Link>
                      <Link
                        href="/products"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                      >
                        All Products
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-green-600 transition-colors flex items-center space-x-1">
                  <span>Sale</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 max-h-80 overflow-y-auto">
                    <div className="space-y-2">
                      <Link
                        href="/products?category=nursing-uniforms"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                      >
                        Nursing Uniforms
                      </Link>
                      <Link
                        href="/products?category=lab-coats"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                      >
                        Lab Coats
                      </Link>
                      <Link
                        href="/products?category=surgical-scrubs"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                      >
                        Surgical Scrubs
                      </Link>
                      <Link
                        href="/products?category=dental-uniforms"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                      >
                        Dental Uniforms
                      </Link>
                      <Link
                        href="/products?category=veterinary-scrubs"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                      >
                        Veterinary Scrubs
                      </Link>
                      <Link
                        href="/products?category=accessories"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                      >
                        Accessories
                      </Link>
                      <Link
                        href="/products?category=footwear"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                      >
                        Medical Footwear
                      </Link>
                      <Link
                        href="/products?category=caps"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                      >
                        Medical Caps
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <Link href="/about" className="text-gray-700 hover:text-black transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-black transition-colors">
                Contact
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Heart className="h-5 w-5" />
              </Button>

              {/* Cart with BLACK badge */}
              <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(true)} className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>

              {/* User Menu */}
              {user ? (
                <div className="relative group">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:block">Sign In</span>
                  </Button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2">
                      <Link
                        href="/account"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        My Account
                      </Link>
                      <button
                        onClick={signOut}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:block">Sign In</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/elite-gowns-logo.png" alt="Elite Gowns" width={32} height={32} className="rounded-full" />
                <span className="font-bold text-lg">Elite Gowns</span>
              </div>
              <p className="text-gray-400 text-sm">
                Premium graduation gowns, medical scrubs, and embroidered merchandise for professionals and students.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/graduation-gowns" className="hover:text-white transition-colors">
                    Graduation Gowns
                  </Link>
                </li>
                <li>
                  <Link href="/medical-scrubs" className="hover:text-white transition-colors">
                    Medical Scrubs
                  </Link>
                </li>
                <li>
                  <Link href="/embroidered-merchandise" className="hover:text-white transition-colors">
                    Embroidered Merchandise
                  </Link>
                </li>
                <li>
                  <Link href="/rental" className="hover:text-white transition-colors">
                    Rental Services
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/size-guide" className="hover:text-white transition-colors">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Elite Gowns. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </div>
  )
}
