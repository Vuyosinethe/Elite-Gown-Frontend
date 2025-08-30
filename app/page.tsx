"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CartDrawer from "@/components/cart-drawer"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { user } = useAuth()
  const { cartCount } = useCart()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src="/elite-gowns-logo.png" alt="Elite Gowns" width={40} height={40} />
              <span className="text-2xl font-bold text-orange-500">Elite Gowns</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-black">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-black">
                Products
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-black">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-black">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setCartOpen(true)}>
                Cart ({cartCount})
              </Button>
              {user ? (
                <Link href="/account" className="text-gray-700 hover:text-black">
                  {user.firstName}
                </Link>
              ) : (
                <Link href="/login" className="text-gray-700 hover:text-black">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Button */}
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

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Premium Academic & Medical Apparel</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our collection of high-quality graduation gowns, medical scrubs, and embroidered merchandise.
          </p>
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/graduation-gowns">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Graduation Gowns</h3>
                  <p className="text-gray-600 mb-4">Premium academic regalia for your special day</p>
                  <Button variant="outline">View Collection</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/medical-scrubs">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏥</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Medical Scrubs</h3>
                  <p className="text-gray-600 mb-4">Comfortable and professional medical wear</p>
                  <Button variant="outline">View Collection</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/embroidered-merchandise">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Embroidered Items</h3>
                  <p className="text-gray-600 mb-4">Custom embroidery for a personal touch</p>
                  <Button variant="outline">View Collection</Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/elite-gowns-logo.png" alt="Elite Gowns" width={32} height={32} />
                <span className="text-xl font-bold text-orange-500">Elite Gowns</span>
              </div>
              <p className="text-gray-400">Premium academic and medical apparel for professionals.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400">
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
                    Embroidered Items
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@elitegowns.co.za</li>
                <li>📞 +27 11 123 4567</li>
                <li>📍 Johannesburg, South Africa</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Elite Gowns. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
