"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Stethoscope, ChevronDown, Menu, X, User, Check, Info, Ruler } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"
import { useAuth } from "@/contexts/auth-context"
import Layout from "@/components/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

export default function MedicalScrubsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { user } = useAuth()
  const [shopOpen, setShopOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedColor, setSelectedColor] = useState("Navy Blue")

  const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL"]
  const colors = ["Navy Blue", "Ceil Blue", "Black", "Wine", "Hunter Green"]

  const router = useRouter()
  const {
    cartItems,
    cartCount,
    subtotal,
    vat,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    addPendingCartItem,
  } = useCart()

  const { wishlistItems, wishlistCount, addToWishlist, removeFromWishlist, isInWishlist, addPendingWishlistItem } =
    useWishlist()

  const product = {
    id: 2,
    name: "Complete Scrub Set",
    category: "Medical Scrubs",
    price: 899,
    image: "/placeholder.svg?height=600&width=600",
    description: "Antimicrobial, moisture-wicking fabric with multiple utility pockets",
    rating: 4.8,
    reviews: 89,
    link: "/medical-scrubs",
  }

  const handleAddToCart = () => {
    addToCart({
      id: 2,
      name: "Complete Scrub Set",
      details: `Size: ${selectedSize}, Color: ${selectedColor}`,
      price: 899,
      image: "/placeholder.svg?height=80&width=80",
    })
  }

  const handleAddToWishlist = async () => {
    const success = await addToWishlist({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description,
      rating: product.rating,
      reviews: product.reviews,
      link: product.link,
    })

    if (!success && !user) {
      // Store the item they wanted to add for after login
      localStorage.setItem("pendingWishlistItem", JSON.stringify(product))
    }
  }

  return (
    <Layout>
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
                    className="text-gray-700 hover:text-black transition-colors relative"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                  className="text-gray-700 hover:text-black transition-colors relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <Image
                  src="/elite-gowns-logo.png"
                  alt="Elite Gowns Logo"
                  width={48}
                  height={48}
                  className="h-10 w-10"
                />
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

        {/* Page Hero */}
        <section className="text-center py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-black mb-4">Professional Medical Scrubs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comfortable, durable scrubs for medical students and professionals
          </p>
        </section>

        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span>/</span>
            <span className="text-black">Medical Scrubs</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Medical professional wearing scrubs"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`aspect-square relative overflow-hidden rounded-lg bg-gray-100 ${
                      i === 1 ? "border-2 border-black" : "hover:border-2 hover:border-gray-300 cursor-pointer"
                    }`}
                  >
                    <Image
                      src="/placeholder.svg?height=150&width=150"
                      alt={`Scrub view ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-2 bg-black text-white inline-flex items-center">
                  <Stethoscope className="w-3 h-3 mr-1" />
                  Medical Grade
                </Badge>
                <h2 className="text-3xl font-bold text-black mb-2">Complete Scrub Set</h2>
                <p className="text-xl text-gray-600">
                  Antimicrobial, moisture-wicking fabric with multiple utility pockets
                </p>
              </div>

              <div className="text-3xl font-bold text-black">R 899.00</div>

              {/* What's Included Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">What's Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>1 x Professional Scrub Top</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>1 x Professional Scrub Pants</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Free Embroidery (Name & Institution)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Care Instructions</span>
                  </li>
                </ul>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Size:</h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Ruler className="w-4 h-4 mr-1" />
                  <Link href="/size-guide" className="underline hover:text-black">
                    View Size Guide
                  </Link>
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Color:</h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className={`w-full py-3 text-lg bg-transparent ${
                    isInWishlist(product.id) ? "text-red-500 border-red-500" : ""
                  }`}
                  onClick={handleAddToWishlist}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  {isInWishlist(product.id) ? "Added to Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </div>
          </div>

          {/* Product Description and Size Guide Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="description">Product Description</TabsTrigger>
                <TabsTrigger value="size-guide">Size Guide</TabsTrigger>
              </TabsList>

              {/* Product Description Tab */}
              <TabsContent value="description" className="space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-2xl font-bold mb-4">Professional Medical Scrubs</h3>
                  <p className="mb-4">
                    Our premium medical scrubs are designed for healthcare professionals who demand comfort, durability,
                    and a professional appearance. Made from high-quality antimicrobial fabric, these scrubs help reduce
                    the spread of bacteria while keeping you comfortable during long shifts.
                  </p>

                  <h4 className="text-xl font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>
                        <strong>Antimicrobial Fabric:</strong> Helps reduce the spread of bacteria and maintains
                        freshness throughout your shift
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>
                        <strong>Moisture-Wicking Technology:</strong> Keeps you dry and comfortable even during the most
                        demanding shifts
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>
                        <strong>Multiple Utility Pockets:</strong> Convenient storage for medical tools, pens, phones,
                        and other essentials
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>
                        <strong>Wrinkle-Resistant:</strong> Maintains a professional appearance throughout your workday
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>
                        <strong>Durable Construction:</strong> Reinforced stitching at stress points ensures
                        long-lasting wear
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>
                        <strong>Customizable:</strong> Free embroidery of your name and institution included
                      </span>
                    </li>
                  </ul>

                  <h4 className="text-xl font-semibold mb-3">Material & Care:</h4>
                  <p className="mb-4">
                    Our scrubs are made from a premium blend of 65% polyester and 35% cotton, providing the perfect
                    balance of comfort and durability. The fabric is specially treated with antimicrobial properties to
                    maintain freshness throughout your shift.
                  </p>
                  <p className="mb-4">
                    <strong>Care Instructions:</strong> Machine wash cold with like colors. Tumble dry low. Do not
                    bleach. Remove promptly from dryer to minimize wrinkles.
                  </p>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start mt-6">
                    <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> Please allow 3-5 business days for embroidery processing before shipping.
                      Custom embroidered items cannot be returned unless there is a manufacturing defect.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Size Guide Tab */}
              <TabsContent value="size-guide">
                <div className="space-y-8">
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Size</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Chest (cm)</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Waist (cm)</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Hip (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="px-6 py-4 font-semibold text-gray-900">XXS</td>
                          <td className="px-6 py-4 text-gray-600">76-81</td>
                          <td className="px-6 py-4 text-gray-600">61-66</td>
                          <td className="px-6 py-4 text-gray-600">84-89</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">XS</td>
                          <td className="px-6 py-4 text-gray-600">81-86</td>
                          <td className="px-6 py-4 text-gray-600">66-71</td>
                          <td className="px-6 py-4 text-gray-600">89-94</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 font-semibold text-gray-900">S</td>
                          <td className="px-6 py-4 text-gray-600">86-91</td>
                          <td className="px-6 py-4 text-gray-600">71-76</td>
                          <td className="px-6 py-4 text-gray-600">94-99</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">M</td>
                          <td className="px-6 py-4 text-gray-600">91-97</td>
                          <td className="px-6 py-4 text-gray-600">76-81</td>
                          <td className="px-6 py-4 text-gray-600">99-104</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 font-semibold text-gray-900">L</td>
                          <td className="px-6 py-4 text-gray-600">97-102</td>
                          <td className="px-6 py-4 text-gray-600">81-86</td>
                          <td className="px-6 py-4 text-gray-600">104-109</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">XL</td>
                          <td className="px-6 py-4 text-gray-600">102-107</td>
                          <td className="px-6 py-4 text-gray-600">86-91</td>
                          <td className="px-6 py-4 text-gray-600">109-114</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 font-semibold text-gray-900">XXL</td>
                          <td className="px-6 py-4 text-gray-600">107-112</td>
                          <td className="px-6 py-4 text-gray-600">91-97</td>
                          <td className="px-6 py-4 text-gray-600">114-119</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold mb-3">How to Measure</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                          <span>
                            <strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape
                            measure level and snug but not tight.
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                          <span>
                            <strong>Waist:</strong> Measure around your natural waistline, which is typically the
                            narrowest part of your torso.
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                          <span>
                            <strong>Hip:</strong> Measure around the fullest part of your hips, typically 8-10 inches
                            below your waist.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">Fitting Tips</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                          <span>Scrubs should allow for comfortable movement throughout your shift.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                          <span>If you're between sizes, we recommend sizing up for a more comfortable fit.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                          <span>Consider the clothing you'll wear underneath your scrubs when selecting a size.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                          <span>
                            Our scrubs are designed with a modern fit that is professional without being too baggy.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold mb-3">Still Not Sure About Your Size?</h4>
                    <p className="mb-4">
                      Our customer service team is here to help you find the perfect fit. Contact us with your
                      measurements, and we'll recommend the best size for you.
                    </p>
                    <Link href="/contact">
                      <Button variant="outline" className="bg-transparent">
                        Contact Customer Service
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={`/placeholder.svg?height=300&width=300`}
                      alt={`Related product ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">
                      {i === 1
                        ? "Medical Scrub Top"
                        : i === 2
                          ? "Medical Scrub Pants"
                          : i === 3
                            ? "Medical Lab Coat"
                            : "Medical Scrub Set"}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">Professional medical wear</p>
                    <p className="font-bold text-black">
                      R {i === 1 || i === 2 ? "499.00" : i === 3 ? "799.00" : "899.00"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Drawer */}
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </Layout>
  )
}
