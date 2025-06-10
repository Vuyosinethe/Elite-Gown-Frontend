"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Truck, Clock, MapPin, Package } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ShippingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const shippingRates = [
    {
      location: "Johannesburg & Surrounding Areas",
      standard: "R50",
      express: "R120",
      time: "1-2 days",
    },
    {
      location: "Cape Town & Western Cape",
      standard: "R80",
      express: "R150",
      time: "2-3 days",
    },
    {
      location: "Durban & KwaZulu-Natal",
      standard: "R80",
      express: "R150",
      time: "2-3 days",
    },
    {
      location: "Other Major Cities",
      standard: "R100",
      express: "R180",
      time: "3-4 days",
    },
    {
      location: "Rural Areas",
      standard: "R150",
      express: "R250",
      time: "4-7 days",
    },
  ]

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
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
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
          <h1 className="text-4xl font-bold text-black mb-4">Shipping Information</h1>
          <p className="text-xl text-gray-600">Fast, reliable delivery across South Africa and internationally</p>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <Truck className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-green-800">Free Shipping Available!</h2>
          </div>
          <p className="text-green-700 text-lg">
            Enjoy free standard shipping on all orders over R500 within South Africa
          </p>
        </div>

        {/* Shipping Options */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Standard Shipping</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <span>3-5 business days delivery</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <span>Free for orders over R500</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <span>Tracking number provided</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <span>Signature required on delivery</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Express Shipping</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <span>1-2 business days delivery</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <span>Additional fee applies</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <span>Priority handling</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <span>Real-time tracking updates</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Rates Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Shipping Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Destination</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Standard</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Express</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Delivery Time</th>
                </tr>
              </thead>
              <tbody>
                {shippingRates.map((rate, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 text-gray-900">{rate.location}</td>
                    <td className="px-6 py-4 text-gray-600">{rate.standard}</td>
                    <td className="px-6 py-4 text-gray-600">{rate.express}</td>
                    <td className="px-6 py-4 text-gray-600">{rate.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* International Shipping */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">International Shipping</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Available Countries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>• United Kingdom</div>
                  <div>• United States</div>
                  <div>• Canada</div>
                  <div>• Australia</div>
                  <div>• Germany</div>
                  <div>• France</div>
                  <div>• Netherlands</div>
                  <div>• Sweden</div>
                  <div>• Botswana</div>
                  <div>• Namibia</div>
                  <div>• Zimbabwe</div>
                  <div>• Zambia</div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Don't see your country? Contact us for availability and rates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>International Rates & Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Africa (SADC Countries)</h4>
                    <p className="text-gray-600">R200-R400 | 5-10 business days</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Europe & UK</h4>
                    <p className="text-gray-600">R350-R600 | 7-14 business days</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">North America</h4>
                    <p className="text-gray-600">R400-R700 | 10-21 business days</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Australia & Asia</h4>
                    <p className="text-gray-600">R450-R800 | 10-21 business days</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  *Rates vary by weight and dimensions. Customs duties may apply.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-black mb-6">Important Shipping Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Processing Time</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Standard items: 1-2 business days</li>
                <li>• Custom embroidery: 5-7 business days</li>
                <li>• Bulk orders (25+ items): 7-10 business days</li>
                <li>• Orders placed after 2 PM ship next business day</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Delivery Requirements</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Signature required for all deliveries</li>
                <li>• Someone must be present to receive package</li>
                <li>• Valid ID required for collection</li>
                <li>• Delivery attempts: 3 times before return</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
