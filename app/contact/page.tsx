"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, Clock, User, Menu, X } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"

export default function ContactPage() {
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
                <Link href="/contact" className="text-black font-semibold">
                  Contact
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => setCartOpen(true)} className="text-gray-700 hover:text-black transition-colors">
                  Cart (0)
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
                Cart (0)
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
                className="block px-3 py-2 rounded-md text-base font-medium text-black bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Contact Elite Gowns</h1>
          <p className="text-xl text-gray-600">An Elite Moment - Get in touch with us</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Leadership</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Mandisa Bhengu</h3>
                    <p className="text-gray-600">Chief Executive Officer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-black text-white p-3 rounded-full">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">081 424 3721</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-black text-white p-3 rounded-full">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">mandisa@elitegowns.co.za</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-black text-white p-3 rounded-full">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">General Info</h3>
                    <p className="text-gray-600">info@elitegowns.co.za</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-black text-white p-3 rounded-full">
                    <Image src="/instagram-logo.png" alt="Instagram" width={20} height={20} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Instagram</h3>
                    <p className="text-gray-600">@elite_gowns24</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-black text-white p-3 rounded-full">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="graduation">Graduation Gowns Inquiry</option>
                    <option value="medical">Medical Scrubs Inquiry</option>
                    <option value="embroidery">Custom Embroidery Quote</option>
                    <option value="bulk">Bulk Order Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Tell us about your requirements..."
                    required
                  ></textarea>
                </div>

                <Button className="w-full bg-black hover:bg-gray-800 text-white py-3">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-black mb-8">Why Choose Elite Gowns?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Expert Leadership</h3>
              <p className="text-gray-600">Led by CEO Mandisa Bhengu with years of industry experience</p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Personal Service</h3>
              <p className="text-gray-600">Direct communication with our team for personalized assistance</p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Quick Response</h3>
              <p className="text-gray-600">Fast turnaround times and responsive customer service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
