"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Palette, Upload, ChevronDown, User, Menu, X } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"
import { useAuth } from "@/contexts/auth-context"

export default function EmbroideredMerchandisePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-black">
                Elite Gowns
              </Link>
              <div className="hidden md:flex space-x-6">
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
                      GRADUATION GOWNS
                    </Link>
                    <Link
                      href="/medical-scrubs"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      MEDICAL SCRUBS
                    </Link>
                    <Link
                      href="/medical-scrubs"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      LAB COATS AND JACKETS
                    </Link>
                    <Link
                      href="/embroidered-merchandise"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      EMBROIDERED MERCHANDISE
                    </Link>
                  </div>
                </div>
                <div className="relative group">
                  <button className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-1">
                    <span>Sale</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      href="/graduation-gowns?sale=true"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      GRADUATION GOWNS ON SALE
                    </Link>
                    <Link
                      href="/medical-scrubs?sale=true"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      MEDICAL SCRUBS ON SALE
                    </Link>
                    <Link
                      href="/embroidered-merchandise?sale=true"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
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
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setCartOpen(true)} className="text-gray-700 hover:text-black transition-colors">
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
              <Image src="/elite-gowns-logo.png" alt="Elite Gowns Logo" width={60} height={60} className="h-12 w-12" />
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
        </div>
      </nav>

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <span className="text-black">Custom Embroidery</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Custom embroidered merchandise"
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 border-2 border-black">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Polo shirt embroidery"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 hover:border-2 hover:border-gray-300 cursor-pointer">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Hoodie embroidery"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 hover:border-2 hover:border-gray-300 cursor-pointer">
                <Image src="/placeholder.svg?height=150&width=150" alt="Cap embroidery" fill className="object-cover" />
              </div>
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 hover:border-2 hover:border-gray-300 cursor-pointer">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Jacket embroidery"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2 bg-purple-600 text-white">
                <Palette className="w-3 h-3 mr-1" />
                Custom Design
              </Badge>
              <h1 className="text-3xl font-bold text-black mb-2">Custom Embroidered Merchandise</h1>
              <p className="text-xl text-gray-600">Professional embroidery services for clubs and organizations</p>
            </div>

            <div className="text-3xl font-bold text-black">From R 199.00</div>

            {/* Product Options */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Available Items:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-black cursor-pointer">
                    <div className="text-2xl mb-2">👕</div>
                    <div className="font-semibold">Polo Shirts</div>
                    <div className="text-sm text-gray-600">From R299</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-black cursor-pointer">
                    <div className="text-2xl mb-2">👔</div>
                    <div className="font-semibold">Hoodies</div>
                    <div className="text-sm text-gray-600">From R499</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-black cursor-pointer">
                    <div className="text-2xl mb-2">🧢</div>
                    <div className="font-semibold">Caps</div>
                    <div className="text-sm text-gray-600">From R199</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-black cursor-pointer">
                    <div className="text-2xl mb-2">🧥</div>
                    <div className="font-semibold">Jackets</div>
                    <div className="text-sm text-gray-600">From R699</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Embroidery Options */}
            <div>
              <h3 className="font-semibold mb-3">Embroidery Services</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium">Logo Embroidery</div>
                    <div className="text-sm text-gray-600">Your organization's logo</div>
                  </div>
                  <div className="text-sm font-semibold">+R50</div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium">Text Embroidery</div>
                    <div className="text-sm text-gray-600">Names, titles, or custom text</div>
                  </div>
                  <div className="text-sm font-semibold">+R30</div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium">Multi-Color Design</div>
                    <div className="text-sm text-gray-600">Complex designs with multiple colors</div>
                  </div>
                  <div className="text-sm font-semibold">+R100</div>
                </div>
              </div>
            </div>

            {/* Upload Design */}
            <div>
              <h3 className="font-semibold mb-3">Upload Your Design</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-black transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">Drag and drop your logo or design file here</p>
                <p className="text-sm text-gray-500">Supported formats: PNG, JPG, SVG, AI, EPS</p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  Choose File
                </Button>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Minimum Order Quantity</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">Bulk Pricing Available</p>
                <p className="text-yellow-700 text-sm mt-1">
                  • 1-9 items: Standard pricing
                  <br />• 10-24 items: 10% discount
                  <br />• 25+ items: 15% discount
                  <br />• 50+ items: Contact for special pricing
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/contact">
                <Button className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg">Get Custom Quote</Button>
              </Link>
              <Button variant="outline" className="w-full py-3 text-lg bg-transparent">
                <Heart className="w-5 h-5 mr-2" />
                Save for Later
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Free design consultation included</p>
              <p>• 7-14 day production time</p>
              <p>• Free delivery for orders over R1000</p>
              <p>• Satisfaction guarantee</p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Our Custom Embroidery Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-bold mb-2">Submit Design</h3>
              <p className="text-gray-600 text-sm">
                Upload your logo or design, or work with our team to create something new
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-bold mb-2">Get Quote</h3>
              <p className="text-gray-600 text-sm">
                Receive a detailed quote with pricing, timeline, and design preview
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-bold mb-2">Production</h3>
              <p className="text-gray-600 text-sm">
                Our skilled team creates your custom embroidered merchandise with precision
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-bold mb-2">Delivery</h3>
              <p className="text-gray-600 text-sm">Quality checked and delivered to your specified location</p>
            </div>
          </div>
        </div>

        {/* Popular Clients */}
        <div className="mt-16 bg-gray-50 p-12 rounded-lg">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Trusted by Wits Organizations</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <h3 className="font-bold text-lg">Wits Debate Society</h3>
                <p className="text-gray-600 text-sm">Custom blazers with embroidered crests</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <h3 className="font-bold text-lg">Medical Students Association</h3>
                <p className="text-gray-600 text-sm">Polo shirts with medical symbols</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <h3 className="font-bold text-lg">Engineering Society</h3>
                <p className="text-gray-600 text-sm">Hoodies with faculty logos</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/contact">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">Join Our Satisfied Clients</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
