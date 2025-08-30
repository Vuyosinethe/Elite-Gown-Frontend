"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, User, X, Menu, ShoppingCart } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"
import CartDrawer from "@/components/cart-drawer"

export default function AboutPage() {
  const { user } = useAuth()
  const { cartCount } = useCart()
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
                  className="relative text-gray-700 hover:text-black transition-colors p-2"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
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
              <button
                onClick={() => setCartOpen(true)}
                className="relative text-gray-700 hover:text-black transition-colors p-2"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
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

      {/* About Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Elite Gowns</h1>

          <div className="prose prose-lg text-gray-700 space-y-6">
            <p>
              Welcome to Elite Gowns, your premier destination for high-quality graduation gowns, medical scrubs, and
              embroidered merchandise. Since our founding, we have been committed to providing exceptional products that
              celebrate your achievements and support your professional journey.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Story</h2>
            <p>
              Elite Gowns was born from a simple belief: that every milestone deserves to be celebrated with dignity and
              style. Whether you're walking across the stage at graduation, starting your career in healthcare, or
              representing your organization, we understand the importance of looking and feeling your best.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
            <p>
              We are dedicated to providing premium-quality garments that combine traditional craftsmanship with modern
              comfort and style. Our mission is to ensure that every customer receives products that not only meet but
              exceed their expectations, backed by exceptional customer service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Graduation Gowns:</strong> Traditional and modern styles for all academic levels
              </li>
              <li>
                <strong>Medical Scrubs:</strong> Comfortable, durable, and professional healthcare attire
              </li>
              <li>
                <strong>Lab Coats & Jackets:</strong> Professional outerwear for medical and scientific professionals
              </li>
              <li>
                <strong>Embroidered Merchandise:</strong> Custom embroidered items for organizations and events
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Quality Commitment</h2>
            <p>
              Every product in our collection is carefully selected and crafted to meet the highest standards of
              quality. We work with trusted manufacturers and use premium materials to ensure durability, comfort, and
              style in every piece we offer.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Customer Service</h2>
            <p>
              At Elite Gowns, customer satisfaction is our top priority. Our knowledgeable team is here to help you find
              the perfect fit and style for your needs. We offer comprehensive size guides, easy returns, and
              personalized customer support to ensure your complete satisfaction.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Ready to Get Started?</h3>
              <p className="text-yellow-700 mb-4">
                Explore our collection and discover the perfect garments for your special occasion or professional
                needs.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/products"
                  className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  href="/contact"
                  className="border border-yellow-600 text-yellow-600 px-6 py-2 rounded-md hover:bg-yellow-50 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
