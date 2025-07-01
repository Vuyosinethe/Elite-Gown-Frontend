"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Stethoscope, ChevronDown, Menu, X, User } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"
import { useAuth } from "@/contexts/auth-context"
import Layout from "@/components/layout"

export default function MedicalScrubsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { user } = useAuth()
  const [shopOpen, setShopOpen] = useState(false)
  const [saleOpen, setSaleOpen] = useState(false)

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="relative">
                    <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent tracking-wide">
                      Elite Gowns
                    </span>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-600 to-yellow-400 group-hover:w-full transition-all duration-300"></div>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <div className="flex space-x-6">
                  <Link href="/" className="text-gray-700 hover:text-black transition-colors">
                    Home
                  </Link>
                  <div className="relative group">
                    <button className="text-gray-700 hover:text-black transition-colors flex items-center space-x-1">
                      <span>Shop</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        href="/graduation-gowns"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        Graduation gowns
                      </Link>
                      <Link
                        href="/medical-scrubs"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        Medical scrubs
                      </Link>
                      <Link
                        href="/medical-scrubs"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        Lab coats and jackets
                      </Link>
                      <Link
                        href="/embroidered-merchandise"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        Embroidered merchandise
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() => setSaleOpen(!saleOpen)}
                          className="w-full text-left px-4 py-2 text-sm text-black border border-green-400 hover:bg-gray-50 flex items-center justify-between transition-colors"
                          style={{ borderColor: "#00ff00" }}
                        >
                          Sale
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </button>
                        {saleOpen && (
                          <div
                            className="absolute left-full top-0 ml-1 w-56 rounded-md shadow-lg z-50"
                            style={{ backgroundColor: "#00ff00" }}
                          >
                            <div className="py-1">
                              <Link
                                href="/graduation-gowns?sale=true"
                                className="block px-4 py-2 text-sm text-black hover:bg-green-300 transition-colors"
                                onClick={() => {
                                  setSaleOpen(false)
                                  setShopOpen(false)
                                }}
                              >
                                Graduation gowns on sale
                              </Link>
                              <Link
                                href="/medical-scrubs?sale=true"
                                className="block px-4 py-2 text-sm text-black hover:bg-green-300 transition-colors"
                                onClick={() => {
                                  setSaleOpen(false)
                                  setShopOpen(false)
                                }}
                              >
                                Medical scrubs on sale
                              </Link>
                              <Link
                                href="/embroidered-merchandise?sale=true"
                                className="block px-4 py-2 text-sm text-black hover:bg-green-300 transition-colors"
                                onClick={() => {
                                  setSaleOpen(false)
                                  setShopOpen(false)
                                }}
                              >
                                Merchandise on sale
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <button className="text-gray-700 hover:text-[#39FF14] transition-colors flex items-center space-x-1">
                      <span>Sale</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 max-h-80 overflow-y-auto">
                      <div className="px-4 py-2 text-sm font-semibold text-gray-900 border-b border-gray-100">
                        Graduation Gowns
                      </div>
                      <Link
                        href="/graduation-gowns?sale=true"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        All Graduation Gowns
                      </Link>
                      <Link
                        href="/graduation-gowns?sale=true&type=bachelor"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        Bachelor Gowns
                      </Link>
                      <Link
                        href="/graduation-gowns?sale=true&type=master"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        Master Gowns
                      </Link>
                      <Link
                        href="/graduation-gowns?sale=true&type=doctoral"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        Doctoral Gowns
                      </Link>

                      <div className="px-4 py-2 text-sm font-semibold text-gray-900 border-b border-gray-100 mt-2">
                        Medical Scrubs
                      </div>
                      <Link
                        href="/medical-scrubs?sale=true"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        All Medical Scrubs
                      </Link>
                      <Link
                        href="/medical-scrubs?sale=true&type=tops"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        Scrub Tops Only
                      </Link>
                      <Link
                        href="/medical-scrubs?sale=true&type=pants"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        Scrub Pants Only
                      </Link>
                      <Link
                        href="/medical-scrubs?sale=true&type=sets"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        Scrub Sets
                      </Link>

                      <div className="px-4 py-2 text-sm font-semibold text-gray-900 border-b border-gray-100 mt-2">
                        Merchandise
                      </div>
                      <Link
                        href="/embroidered-merchandise?sale=true"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        All Merchandise
                      </Link>
                      <Link
                        href="/embroidered-merchandise?sale=true&type=polo"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        Polo Shirts
                      </Link>
                      <Link
                        href="/embroidered-merchandise?sale=true&type=tshirts"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        T-Shirts
                      </Link>
                      <Link
                        href="/embroidered-merchandise?sale=true&type=hoodies"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        Hoodies
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
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCartOpen(true)}
                    className="text-gray-700 hover:text-black transition-colors"
                  >
                    {user ? "Cart (0)" : "Cart"}
                  </button>
                  {user ? (
                    <Link
                      href="/account"
                      className="flex items-center space-x-2 text-gray-700 hover:text-black transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>{user.firstName}</span>
                    </Link>
                  ) : (
                    <Link href="/login" className="text-gray-700 hover:text-black transition-colors">
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

              {/* Mobile Navigation Button */}
              <div className="flex items-center space-x-4 md:hidden">
                <button onClick={() => setCartOpen(true)} className="text-gray-700 hover:text-black transition-colors">
                  {user ? "Cart (0)" : "Cart"}
                </button>
                <Image
                  src="/elite-gowns-logo.png"
                  alt="Elite Gowns Logo"
                  width={48}
                  height={48}
                  className="h-10 w-10"
                />
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-700 hover:text-black focus:outline-none"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
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
                <Link
                  href="/products?sale=true"
                  className="block px-3 py-2 rounded-md text-base font-medium text-[#39FF14] hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sale
                </Link>
                <div className="px-3 py-2">
                  <span className="text-base font-medium text-red-600">Sale</span>
                  <div className="ml-4 mt-2 space-y-1">
                    <Link
                      href="/graduation-gowns?sale=true"
                      className="block px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Graduation gowns on sale
                    </Link>
                    <Link
                      href="/medical-scrubs?sale=true"
                      className="block px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Medical scrubs on sale
                    </Link>
                    <Link
                      href="/embroidered-merchandise?sale=true"
                      className="block px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Merchandise on sale
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

        {/* Page Hero */}
        <section className="text-center py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-black mb-4">Professional Medical Scrubs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comfortable, durable scrubs for medical students and professionals
          </p>
        </section>

        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span>/</span>
            <span className="text-black">Medical Scrubs</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
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

            {/* Details */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-2 bg-black text-white inline-flex items-center">
                  <Stethoscope className="w-3 h-3 mr-1" />
                  Medical Grade
                </Badge>
                <h2 className="text-3xl font-bold text-black mb-2">Complete Scrub Set</h2>
                <p className="text-xl text-gray-600">
                  Antimicrobial, moisture-wicking fabric with multiple utility pockets
                </p>
              </div>

              <div className="text-3xl font-bold text-black">R 899.00</div>

              {/* Actions */}
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

        {/* Cart Drawer */}
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </Layout>
  )
}
