"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Stethoscope } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"
import { useAuth } from "@/contexts/auth-context"

export default function MedicalScrubsPage() {
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
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setCartOpen(true)} className="text-gray-700 hover:text-black transition-colors">
                {user ? "Cart (0)" : "Cart"}
              </button>
              <Image src="/elite-gowns-logo.png" alt="Elite Gowns Logo" width={60} height={60} className="h-12 w-12" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <span className="text-black">Medical Scrubs</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Medical professional wearing scrubs"
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
              <Badge className="mb-2 bg-blue-600 text-white">
                <Stethoscope className="w-3 h-3 mr-1" />
                Medical Grade
              </Badge>
              <h1 className="text-3xl font-bold text-black mb-2">Professional Medical Scrubs Set</h1>
              <p className="text-xl text-gray-600">
                Comfortable, durable scrubs for medical students and professionals
              </p>
            </div>

            <div className="text-3xl font-bold text-black">R 899.00</div>

            {/* Product Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Features & Benefits:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Antimicrobial fabric treatment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Moisture-wicking and breathable</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Multiple pockets for medical tools</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Easy-care, wrinkle-resistant fabric</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Reinforced stress points for durability</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <Button key={size} variant="outline" className="hover:bg-black hover:text-white">
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Available Colors</h3>
              <div className="mb-4">
                <Image
                  src="/medical-scrubs-colors.png"
                  alt="Available scrub colors"
                  width={400}
                  height={200}
                  className="rounded-lg border border-gray-200"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                We offer a comprehensive range of professional medical colors. Popular choices include:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  • <strong>Black</strong> - Most popular choice
                </div>
                <div>
                  • <strong>Grey</strong> - Professional neutral
                </div>
                <div>
                  • <strong>Dark Navy</strong> - Classic medical
                </div>
                <div>• Royal Blue - Traditional choice</div>
                <div>• Teal - Modern medical</div>
                <div>• Hunter Green - Surgical preference</div>
                <div>• Burgundy - Elegant choice</div>
                <div>• Purple - Popular choice</div>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">
                  🔥 Most Popular: Black, Grey, and Dark Navy are our top-selling colors for medical professionals
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * Colors may vary slightly from screen display. Contact us for color matching or bulk orders.
              </p>
            </div>

            {/* Set Options */}
            <div>
              <h3 className="font-semibold mb-3">Set Options</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="set" className="text-black" defaultChecked />
                  <span>Complete Set (Top + Pants) - R899</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="set" className="text-black" />
                  <span>Top Only - R499</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="set" className="text-black" />
                  <span>Pants Only - R449</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full py-3 text-lg">
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Free delivery for orders over R500</p>
              <p>• 30-day return policy</p>
              <p>• Machine washable at 60°C</p>
              <p>• Bulk discounts available for institutions</p>
            </div>

            {/* Rental Option */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-lg mb-3 text-blue-800">Short-term Rental Available</h3>
              <p className="text-blue-700 mb-4">
                Need scrubs for clinical rotations or short-term placements? Rent for R150/week!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/rental">
                  <Button variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-100">
                    Learn About Rental
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Inquire About Rental</Button>
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
                Our professional medical scrubs are designed specifically for medical students and healthcare
                professionals who demand comfort, durability, and functionality. Made from a premium poly-cotton blend
                with antimicrobial treatment.
              </p>
              <p className="text-gray-600 mb-4">
                The fabric is specially treated to resist bacteria and odors, while remaining soft and comfortable
                throughout long shifts. Multiple pockets provide convenient storage for medical instruments, pens, and
                personal items.
              </p>
              <p className="text-gray-600">
                Available in a range of professional colors suitable for various medical environments. The modern fit
                provides freedom of movement while maintaining a professional appearance.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Care Instructions</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <span>Machine wash in warm water (60°C max)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <span>Use mild detergent, avoid bleach</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <span>Tumble dry on low heat</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <span>Iron on medium heat if needed</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <span>Antimicrobial treatment lasts 50+ washes</span>
                </li>
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
