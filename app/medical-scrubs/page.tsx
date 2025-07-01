"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Stethoscope, ChevronDown, Menu, X, User } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"
import { useAuth } from "@/contexts/auth-context"

export default function MedicalScrubsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* ---------------- NAVIGATION ---------------- */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* logo ---------------- */}
            <Link href="/" className="flex items-center space-x-3 group">
              <span className="relative text-2xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent tracking-wide">
                Elite Gowns
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-600 to-yellow-400 group-hover:w-full transition-all duration-300" />
              </span>
            </Link>

            {/* desktop links -------------- */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-6">
                <Link href="/" className="text-gray-700 hover:text-black transition-colors">
                  Home
                </Link>

                {/* ----- SHOP DROPDOWN ----- */}
                <div className="relative group">
                  <button className="text-gray-700 hover:text-black transition-colors flex items-center space-x-1">
                    <span>Shop</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      href="/graduation-gowns"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                    >
                      GRADUATION GOWNS
                    </Link>
                    <Link
                      href="/medical-scrubs"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                    >
                      MEDICAL SCRUBS
                    </Link>
                    <Link
                      href="/medical-scrubs"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                    >
                      LAB COATS & JACKETS
                    </Link>
                    <Link
                      href="/embroidered-merchandise"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                    >
                      EMBROIDERED MERCHANDISE
                    </Link>
                  </div>
                </div>

                {/* ----- SALE DROPDOWN ----- */}
                <div className="relative group">
                  <button className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-1">
                    <span>Sale</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      href="/graduation-gowns?sale=true"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                    >
                      GRADUATION GOWNS ON SALE
                    </Link>
                    <Link
                      href="/medical-scrubs?sale=true"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                    >
                      MEDICAL SCRUBS ON SALE
                    </Link>
                    <Link
                      href="/embroidered-merchandise?sale=true"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                    >
                      MERCHANDISE ON SALE
                    </Link>
                  </div>
                </div>

                <Link href="/about" className="text-gray-700 hover:text-black transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-black transition-colors">
                  Contact
                </Link>
              </div>

              {/* right-hand controls */}
              <div className="flex items-center space-x-4">
                <button onClick={() => setCartOpen(true)} className="text-gray-700 hover:text-black transition-colors">
                  {user ? "Cart (0)" : "Cart"}
                </button>
                {user ? (
                  <Link href="/account" className="flex items-center space-x-2 text-gray-700 hover:text-black">
                    <User className="w-4 h-4" />
                    <span>{user.firstName}</span>
                  </Link>
                ) : (
                  <Link href="/login" className="text-gray-700 hover:text-black">
                    Sign In
                  </Link>
                )}
                <Image
                  src="/elite-gowns-logo.png"
                  alt="Elite Gowns Logo"
                  width={60}
                  height={60}
                  className="h-12 w-12"
                />
              </div>
            </div>

            {/* mobile hamburger ------------- */}
            <div className="flex items-center space-x-4 md:hidden">
              <button onClick={() => setCartOpen(true)} className="text-gray-700 hover:text-black transition-colors">
                {user ? "Cart (0)" : "Cart"}
              </button>
              <Image src="/elite-gowns-logo.png" alt="Elite Gowns Logo" width={48} height={48} className="h-10 w-10" />
              <button
                type="button"
                className="p-2 rounded-md text-gray-700 hover:text-black focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ------------- MOBILE MENU ------------- */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>

              {/* mobile sale sub-links */}
              <div className="px-3 py-2">
                <span className="text-base font-medium text-red-600">Sale</span>
                <div className="ml-4 mt-2 space-y-1">
                  <Link
                    href="/graduation-gowns?sale=true"
                    className="block px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Graduation Gowns on Sale
                  </Link>
                  <Link
                    href="/medical-scrubs?sale=true"
                    className="block px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Medical Scrubs on Sale
                  </Link>
                  <Link
                    href="/embroidered-merchandise?sale=true"
                    className="block px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Merchandise on Sale
                  </Link>
                </div>
              </div>

              <Link
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {user ? (
                <Link
                  href="/account"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ---------------- PAGE HERO ---------------- */}
      <header className="text-center py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-black mb-4">Professional Medical Scrubs</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comfortable, durable scrubs for medical students and professionals
        </p>
      </header>

      {/* --------- PRODUCT SECTION (static example) --------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Medical professional wearing scrubs"
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`aspect-square relative overflow-hidden rounded-lg bg-gray-100 ${
                    i === 1 ? "border-2 border-black" : "hover:border-2 hover:border-gray-300 cursor-pointer"
                  }`}
                >
                  <Image
                    src="/placeholder.svg?height=150&width=150"
                    alt={`Scrub view ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2 bg-blue-600 text-white inline-flex items-center">
                <Stethoscope className="w-3 h-3 mr-1" />
                Medical Grade
              </Badge>
              <h2 className="text-3xl font-bold text-black mb-2">Complete Scrub Set</h2>
              <p className="text-xl text-gray-600">
                Antimicrobial, moisture-wicking fabric with multiple utility pockets
              </p>
            </div>

            <div className="text-3xl font-bold text-black">R 899.00</div>

            {/* actions */}
            <div className="space-y-3">
              <Button className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full py-3 text-lg bg-transparent">
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- CART DRAWER ---------- */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
