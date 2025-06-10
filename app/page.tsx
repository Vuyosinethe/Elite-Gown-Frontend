"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Smartphone, Building2, Menu, X } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

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
                <Link href="/products" className="text-gray-700 hover:text-black transition-colors">
                  Products
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-black transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-black transition-colors">
                  Contact
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => setCartOpen(true)} className="text-gray-700 hover:text-black transition-colors">
                  Cart (2)
                </button>
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
                Cart (2)
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
                Products
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
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">An Elite Moment</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Premium graduation gowns, medical scrubs, and custom embroidered merchandise for your most important
            moments.
          </p>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-black mb-12">Our Products</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Graduation Gowns */}
            <Link href="/graduation-gowns">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-navy-600">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Graduation Gowns"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-black mb-3">Graduation Gowns</h3>
                    <p className="text-gray-600 mb-4">
                      Complete graduation sets including gowns, mortarboards, and sashes. Perfect for your special day.
                    </p>
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">Shop Graduation Wear</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Medical Scrubs */}
            <Link href="/medical-scrubs">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-navy-600">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Medical Scrubs"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-black mb-3">Medical School Scrubs</h3>
                    <p className="text-gray-600 mb-4">
                      Professional medical scrubs for students and healthcare professionals. Comfortable and durable.
                    </p>
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">Shop Medical Scrubs</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Embroidered Merchandise */}
            <Link href="/embroidered-merchandise">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-navy-600">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Embroidered Merchandise"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-black mb-3">Merchandise Embroidery</h3>
                    <p className="text-gray-600 mb-4">
                      Custom embroidered merchandise for Wits social clubs and organizations. High-quality
                      personalization.
                    </p>
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">Shop Custom Embroidery</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-black mb-8">Secure Payment Options</h2>
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <CreditCard className="h-8 w-8" />
              <span className="font-semibold">VISA</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <CreditCard className="h-8 w-8" />
              <span className="font-semibold">MasterCard</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Building2 className="h-8 w-8" />
              <span className="font-semibold">EFT</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Smartphone className="h-8 w-8" />
              <span className="font-semibold">Mobile Pay</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Elite Gowns</h3>
              <p className="text-gray-300 mb-4">An Elite Moment</p>
              <div className="space-y-2 text-gray-300">
                <p>CEO: Mandisa Bhengu</p>
                <p>📞 081 424 3721</p>
                <p>✉️ mandisa@elitegowns.co.za</p>
                <p>📱 @elite_gowns24</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/graduation-gowns" className="hover:text-white">
                    Graduation Gowns
                  </Link>
                </li>
                <li>
                  <Link href="/medical-scrubs" className="hover:text-white">
                    Medical Scrubs
                  </Link>
                </li>
                <li>
                  <Link href="/embroidered-merchandise" className="hover:text-white">
                    Custom Embroidery
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white">
                    Shipping Info
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="hover:text-white">
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Elite Gowns. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
