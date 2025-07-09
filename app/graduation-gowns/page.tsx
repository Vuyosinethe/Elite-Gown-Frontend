"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"
import Layout from "@/components/layout"

export default function GraduationGownsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { user } = useAuth()
  const [shopOpen, setShopOpen] = useState(false)
  const [saleOpen, setSaleOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedFaculty, setSelectedFaculty] = useState("")
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedFaculty) {
      alert("Please select both size and faculty color")
      return
    }

    setAddingToCart(true)
    try {
      const result = await addToCart({
        id: 1,
        name: "Complete Graduation Set",
        details: `Size: ${selectedSize}, Faculty: ${selectedFaculty}`,
        price: 129900, // Price in cents
        image: "/placeholder.svg?height=80&width=80",
      })

      if (result.success) {
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000) // Reset after 2 seconds
      } else {
        alert("Failed to add item to cart: " + (result.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add item to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <Layout>
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
                  <Button
                    key={size}
                    variant="outline"
                    className={`hover:bg-black hover:text-white bg-transparent ${
                      selectedSize === size ? "bg-black text-white" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Faculty Color */}
            <div>
              <h3 className="font-semibold mb-3">Faculty Sash Color</h3>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
              >
                <option value="">Select your faculty</option>
                <option value="Commerce - Red">Commerce - Red</option>
                <option value="Engineering - Orange">Engineering - Orange</option>
                <option value="Medicine - Green">Medicine - Green</option>
                <option value="Law - Purple">Law - Purple</option>
                <option value="Arts - White">Arts - White</option>
                <option value="Science - Yellow">Science - Yellow</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className={`w-full py-3 text-lg transition-all duration-200 ${
                  addedToCart ? "bg-green-600 hover:bg-green-700 text-white" : "bg-black hover:bg-gray-800 text-white"
                }`}
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedSize || !selectedFaculty}
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : addedToCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
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
    </Layout>
  )
}
