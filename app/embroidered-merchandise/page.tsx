import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Palette, Upload } from "lucide-react"

export default function EmbroideredMerchandisePage() {
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
          <span className="text-black">Custom Embroidery</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Custom embroidered merchandise"
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 border-2 border-black">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Polo shirt embroidery"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 hover:border-2 hover:border-gray-300 cursor-pointer">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Hoodie embroidery"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 hover:border-2 hover:border-gray-300 cursor-pointer">
                <Image src="/placeholder.svg?height=150&width=150" alt="Cap embroidery" fill className="object-cover" />
              </div>
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 hover:border-2 hover:border-gray-300 cursor-pointer">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Jacket embroidery"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2 bg-purple-600 text-white">
                <Palette className="w-3 h-3 mr-1" />
                Custom Design
              </Badge>
              <h1 className="text-3xl font-bold text-black mb-2">Custom Embroidered Merchandise</h1>
              <p className="text-xl text-gray-600">
                Professional embroidery services for Wits social clubs and organizations
              </p>
            </div>

            <div className="text-3xl font-bold text-black">From R 299.00</div>

            {/* Service Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Our Services Include:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Custom logo digitization and setup</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>High-quality thread embroidery</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Multiple garment options available</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Bulk order discounts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Fast turnaround (5-7 business days)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Garment Selection */}
            <div>
              <h3 className="font-semibold mb-3">Select Garment Type</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto p-4 hover:bg-black hover:text-white">
                  <div className="text-center">
                    <div className="font-semibold">Polo Shirt</div>
                    <div className="text-sm text-gray-500">From R299</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 hover:bg-black hover:text-white">
                  <div className="text-center">
                    <div className="font-semibold">Hoodie</div>
                    <div className="text-sm text-gray-500">From R499</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 hover:bg-black hover:text-white">
                  <div className="text-center">
                    <div className="font-semibold">Cap/Hat</div>
                    <div className="text-sm text-gray-500">From R199</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 hover:bg-black hover:text-white">
                  <div className="text-center">
                    <div className="font-semibold">Jacket</div>
                    <div className="text-sm text-gray-500">From R699</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <h3 className="font-semibold mb-3">Upload Your Logo/Design</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG, SVG up to 10MB</p>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  -
                </Button>
                <span className="text-xl font-semibold px-4">1</span>
                <Button variant="outline" size="sm">
                  +
                </Button>
                <span className="text-sm text-gray-600 ml-4">
                  Bulk discounts: 10+ items (10% off), 25+ items (15% off)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg">Get Custom Quote</Button>
              <Button variant="outline" className="w-full py-3 text-lg">
                <Heart className="w-5 h-5 mr-2" />
                Save Design
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Free design consultation included</p>
              <p>• 5-7 business day turnaround</p>
              <p>• Minimum order: 1 piece</p>
              <p>• Special rates for Wits student organizations</p>
            </div>
          </div>
        </div>

        {/* Popular Wits Organizations */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-black mb-8 text-center">Popular Wits Social Clubs & Organizations</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              "Wits Debating Society",
              "Golden Key Society",
              "Student Representative Council",
              "Wits Drama Society",
              "Commerce Students Council",
              "Engineering Students Council",
              "Medical Students Council",
              "Wits Choir",
              "Dance Society",
              "Photography Society",
              "Entrepreneurship Society",
              "International Students Association",
            ].map((club) => (
              <Card key={club} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-sm">{club}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Steps */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-black mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Choose Garment</h3>
              <p className="text-sm text-gray-600">Select from our range of quality garments</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Upload Design</h3>
              <p className="text-sm text-gray-600">Send us your logo or let us create one</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Quote</h3>
              <p className="text-sm text-gray-600">Receive detailed pricing and timeline</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Receive Order</h3>
              <p className="text-sm text-gray-600">Professional embroidery delivered to you</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
