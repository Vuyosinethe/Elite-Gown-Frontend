"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Menu, X, ChevronDown, User } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"
import { useAuth } from "@/contexts/auth-context"

export default function GraduationGownsPage() {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <span className="text-black">Graduation Gowns</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Graduate wearing cap and gown"
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 border-2 border-black">
                <Image src="/placeholder.svg?height=150&width=150" alt="Front view" fill className="object-cover" />
              </div>
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 hover:border-2 hover:border-gray-300 cursor-pointer">
                <Image src="/placeholder.svg?height=150&width=150" alt="Back view" fill className="object-cover" />
              </div>
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 hover:border-2 hover:border-gray-300 cursor-pointer">
                <Image src="/placeholder.svg?height=150&width=150" alt="Side view" fill className="object-cover" />
              </div>
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 hover:border-2 hover:border-gray-300 cursor-pointer">
                <Image src="/placeholder.svg?height=150&width=150" alt="Detail view" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2 bg-black text-white">Best Seller</Badge>
              <h1 className="text-3xl font-bold text-black mb-2">Complete Graduation Set</h1>
              <p className="text-xl text-gray-600">Premium quality graduation attire for your special day</p>
            </div>

            <div className="text-3xl font-bold text-black">R 1,299.00</div>

            {/* Product Breakdown */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">What's Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Premium graduation gown with proper draping</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Traditional mortarboard cap with tassel</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Academic sash (color varies by faculty)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Professional garment bag for storage</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <Button key={size} variant="outline" className="hover:bg-black hover:text-white bg-transparent">
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Faculty Color */}
            <div>
              <h3 className="font-semibold mb-3">Faculty Sash Color</h3>
              <select className="w-full p-3 border border-gray-300 rounded-lg">
                <option>Select your faculty</option>
                <option>Commerce - Red</option>
                <option>Engineering - Orange</option>
                <option>Medicine - Green</option>
                <option>Law - Purple</option>
                <option>Arts - White</option>
                <option>Science - Yellow</option>
              </select>
            </div>

            {/* Action Buttons */}
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

            {/* Additional Info */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Free delivery for orders over R500</p>
              <p>• 30-day return policy</p>
              <p>• Professional dry cleaning recommended</p>
              <p>• Available for rental (R299/day)</p>
            </div>

            {/* Rental Option */}
            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-bold text-lg mb-3 text-yellow-800">Rental Option Available</h3>
              <p className="text-yellow-700 mb-4">
                Don't want to purchase? Rent this complete graduation set for just R299/day!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/rental">
                  <Button
                    variant="outline"
                    className="border-yellow-600 text-yellow-700 hover:bg-yellow-100 bg-transparent"
                  >
                    Learn About Rental
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">Inquire About Rental</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16 grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Product Description</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">
                Our premium graduation sets are crafted with attention to detail and academic tradition. Made from
                high-quality polyester fabric, these gowns provide the perfect drape and professional appearance for
                your graduation ceremony.
              </p>
              <p className="text-gray-600 mb-4">
                Each set includes everything you need for your special day: a properly fitted gown, traditional
                mortarboard cap with moveable tassel, and faculty-specific colored sash. The gown features traditional
                academic styling with pointed sleeves and proper length.
              </p>
              <p className="text-gray-600">
                Perfect for university graduations, our sets meet all academic dress code requirements and are available
                in all standard sizes. Professional pressing and garment bag included.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Size Guide</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Size</th>
                    <th className="text-left py-2">Height</th>
                    <th className="text-left py-2">Chest</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b">
                    <td className="py-2">XS</td>
                    <td className="py-2">150-160cm</td>
                    <td className="py-2">80-90cm</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">S</td>
                    <td className="py-2">160-170cm</td>
                    <td className="py-2">90-100cm</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">M</td>
                    <td className="py-2">170-180cm</td>
                    <td className="py-2">100-110cm</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">L</td>
                    <td className="py-2">180-190cm</td>
                    <td className="py-2">110-120cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
