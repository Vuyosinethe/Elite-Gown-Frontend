"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, User, X, Menu, ShoppingCart, Mail, Phone, MapPin, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"
import CartDrawer from "@/components/cart-drawer"

export default function ContactPage() {
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

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-700 mb-8">
                We're here to help! Whether you have questions about our products, need assistance with sizing, or want
                to discuss custom orders, our team is ready to assist you.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Mail className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="text-gray-700">info@elitegowns.co.za</p>
                    <p className="text-gray-700">support@elitegowns.co.za</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Phone className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-700">+27 11 123 4567</p>
                    <p className="text-gray-700">+27 82 987 6543</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <MapPin className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Address</h3>
                    <p className="text-gray-700">
                      123 Fashion Street
                      <br />
                      Johannesburg, 2000
                      <br />
                      South Africa
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                    <p className="text-gray-700">
                      Monday - Friday: 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="sizing">Sizing Help</option>
                    <option value="custom">Custom Order</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Please provide details about your inquiry..."
                    required
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-yellow-600 text-white px-6 py-3 rounded-md font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">How do I determine my size?</h3>
                <p className="text-gray-700">
                  We provide detailed size guides for all our products. You can find the size guide on each product page
                  or visit our dedicated{" "}
                  <Link href="/size-guide" className="text-yellow-600 hover:underline">
                    Size Guide
                  </Link>{" "}
                  page.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">What is your return policy?</h3>
                <p className="text-gray-700">
                  We offer a 30-day return policy for unused items in original condition. Visit our{" "}
                  <Link href="/returns" className="text-yellow-600 hover:underline">
                    Returns
                  </Link>{" "}
                  page for full details.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Do you offer custom embroidery?</h3>
                <p className="text-gray-700">
                  Yes! We offer custom embroidery services for bulk orders. Contact us for pricing and minimum order
                  quantities.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">How long does shipping take?</h3>
                <p className="text-gray-700">
                  Standard shipping takes 3-5 business days within South Africa. Check our{" "}
                  <Link href="/shipping" className="text-yellow-600 hover:underline">
                    Shipping
                  </Link>{" "}
                  page for more details.
                </p>
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
