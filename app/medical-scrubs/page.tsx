import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Stethoscope } from "lucide-react"

export default function MedicalScrubsPage() {
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
              <Link href="/cart" className="text-gray-700 hover:text-black transition-colors">
                Cart (0)
              </Link>
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
              <h3 className="font-semibold mb-3">Color</h3>
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full border-2 border-black cursor-pointer"></div>
                <div className="w-10 h-10 bg-green-600 rounded-full border-2 border-gray-300 hover:border-gray-400 cursor-pointer"></div>
                <div className="w-10 h-10 bg-purple-600 rounded-full border-2 border-gray-300 hover:border-gray-400 cursor-pointer"></div>
                <div className="w-10 h-10 bg-gray-600 rounded-full border-2 border-gray-300 hover:border-gray-400 cursor-pointer"></div>
                <div className="w-10 h-10 bg-pink-400 rounded-full border-2 border-gray-300 hover:border-gray-400 cursor-pointer"></div>
              </div>
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
              <Button className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg">
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
    </div>
  )
}
