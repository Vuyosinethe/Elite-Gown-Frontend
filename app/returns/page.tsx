"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, RotateCcw, Clock, CheckCircle, XCircle, ChevronDown, User } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export default function ReturnsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { user } = useAuth()

  return (
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
                    <Link
                      href="/products"
                      className="block px-4 py-2 text-sm text-red-600 font-bold hover:bg-gray-50 hover:text-red-700 transition-colors"
                    >
                      SALE
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
              <Image src="/elite-gowns-logo.png" alt="Elite Gowns Logo" width={48} height={48} className="h-10 w-10" />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Returns & Exchanges</h1>
          <p className="text-xl text-gray-600">Easy returns and exchanges for your peace of mind</p>
        </div>

        {/* Return Policy Overview */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <RotateCcw className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-green-800">30-Day Return Policy</h2>
          </div>
          <p className="text-green-700 text-lg">
            We offer hassle-free returns within 30 days of purchase for your complete satisfaction
          </p>
        </div>

        {/* Return Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">How to Return an Item</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Contact Us</h3>
              <p className="text-gray-600 text-sm">
                Email returns@elitegowns.co.za with your order number and reason for return
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Get Authorization</h3>
              <p className="text-gray-600 text-sm">
                Receive your return authorization number and shipping instructions within 24 hours
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Package & Ship</h3>
              <p className="text-gray-600 text-sm">
                Pack the item securely in original packaging and ship using provided instructions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Get Refund</h3>
              <p className="text-gray-600 text-sm">
                Receive your refund within 5-7 business days after we receive your return
              </p>
            </div>
          </div>
        </div>

        {/* Return Conditions */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Returnable Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span>Unused graduation gowns in original packaging</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span>Medical scrubs with tags attached</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span>Blank embroidered merchandise (no custom work)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span>Items returned within 30 days of purchase</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span>Items in original condition with receipt</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span>Non-Returnable Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <span>Custom embroidered items (unless defective)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <span>Items worn or used</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <span>Items without original tags or packaging</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <span>Items returned after 30 days</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <span>Rental items (different policy applies)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Exchanges */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Exchanges</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Size Exchanges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Need a different size? We offer free size exchanges within 30 days of purchase.
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Same item, different size only</li>
                  <li>• Original item must be unused</li>
                  <li>• Free return shipping provided</li>
                  <li>• New item shipped immediately</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Exchanges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Want a different color? Exchange for the same item in a different available color.
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Same item, different color</li>
                  <li>• Subject to availability</li>
                  <li>• Standard return shipping applies</li>
                  <li>• Price difference may apply</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Defective Items</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Received a defective item? We'll replace it immediately at no cost to you.
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Free replacement or full refund</li>
                  <li>• Free return shipping</li>
                  <li>• Priority processing</li>
                  <li>• Photo documentation may be required</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Refund Information */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Refund Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Processing Times</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Return Processing</h4>
                    <p className="text-gray-600 text-sm">1-2 business days after we receive your return</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Refund to Original Payment</h4>
                    <p className="text-gray-600 text-sm">3-5 business days for credit cards, 5-7 days for EFT</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Store Credit</h4>
                    <p className="text-gray-600 text-sm">Immediate upon return processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refund Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Original Payment Method</h4>
                    <p className="text-gray-600 text-sm">
                      Refunds are processed back to your original payment method (credit card, EFT, etc.)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Store Credit Option</h4>
                    <p className="text-gray-600 text-sm">
                      Choose store credit for faster processing and receive a 10% bonus on your refund amount
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Need Help with Your Return?</h2>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to assist you with any questions about returns or exchanges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact?subject=Returns%20Inquiry">
              <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md">Email Returns Team</button>
            </Link>
            <Link href="/contact">
              <button className="bg-white border border-gray-300 hover:bg-gray-50 text-black px-6 py-3 rounded-md">
                Contact Us
              </button>
            </Link>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            <p>Returns Email: returns@elitegowns.co.za</p>
            <p>Phone: 081 424 3721 | Business Hours: Mon-Fri 8AM-6PM</p>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
