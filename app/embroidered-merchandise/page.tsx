"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Menu, X, Star, ChevronDown, User, Palette, Shirt } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

export default function EmbroideredMerchandisePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const { user } = useAuth()
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

  const products = [
    {
      id: 3,
      name: "Custom Embroidered Polo Shirt",
      category: "Embroidered Merchandise",
      price: 299,
      image: "/placeholder.svg?height=400&width=400",
      badge: "Custom Design",
      badgeColor: "bg-black",
      description: "High-quality polo shirts with custom embroidery for clubs and organizations",
      rating: 4.7,
      reviews: 156,
      link: "/embroidered-merchandise",
    },
    {
      id: 4,
      name: "Custom Embroidered Hoodie",
      category: "Embroidered Merchandise",
      price: 499,
      image: "/placeholder.svg?height=400&width=400",
      badge: "Popular",
      badgeColor: "bg-black",
      description: "Comfortable hoodies with professional embroidery services",
      rating: 4.6,
      reviews: 73,
      link: "/embroidered-merchandise",
    },
    {
      id: 7,
      name: "Custom Embroidered Cap",
      category: "Embroidered Merchandise",
      price: 199,
      image: "/placeholder.svg?height=400&width=400",
      badge: "Affordable",
      badgeColor: "bg-black",
      description: "Quality caps with custom embroidery for teams and clubs",
      rating: 4.3,
      reviews: 92,
      link: "/embroidered-merchandise",
    },
    {
      id: 8,
      name: "Custom Embroidered Jacket",
      category: "Embroidered Merchandise",
      price: 699,
      image: "/placeholder.svg?height=400&width=400",
      badge: "Premium",
      badgeColor: "bg-black",
      description: "Professional jackets with high-quality embroidery",
      rating: 4.8,
      reviews: 34,
      link: "/embroidered-merchandise",
    },
    {
      id: 10,
      name: "Custom Embroidered T-Shirt",
      category: "Embroidered Merchandise",
      price: 199,
      image: "/placeholder.svg?height=400&width=400",
      badge: "Basic",
      badgeColor: "bg-black",
      description: "Quality t-shirts with custom embroidery for events and clubs",
      rating: 4.4,
      reviews: 89,
      link: "/embroidered-merchandise",
    },
    {
      id: 11,
      name: "Custom Embroidered Tracksuit",
      category: "Embroidered Merchandise",
      price: 799,
      image: "/placeholder.svg?height=400&width=400",
      badge: "Complete Set",
      badgeColor: "bg-black",
      description: "Full tracksuit with custom embroidery for sports teams",
      rating: 4.7,
      reviews: 45,
      link: "/embroidered-merchandise",
    },
  ]

  const categories = ["All", "Polo Shirts", "Hoodies", "T-Shirts", "Caps", "Jackets", "Tracksuits"]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => {
          if (selectedCategory === "Polo Shirts") return product.name.includes("Polo")
          if (selectedCategory === "Hoodies") return product.name.includes("Hoodie")
          if (selectedCategory === "T-Shirts") return product.name.includes("T-Shirt")
          if (selectedCategory === "Caps") return product.name.includes("Cap")
          if (selectedCategory === "Jackets") return product.name.includes("Jacket")
          if (selectedCategory === "Tracksuits") return product.name.includes("Tracksuit")
          return true
        })

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      details: `Category: ${product.category}`,
      price: product.price,
      image: product.image,
    })
  }

  const handleAddToWishlist = async (product: any) => {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Palette className="w-8 h-8 text-black" />
            <h1 className="text-4xl font-bold text-black">Custom Embroidered Merchandise</h1>
            <Shirt className="w-8 h-8 text-black" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            High-quality custom embroidery services for Wits social clubs, organizations, and teams
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-black text-white" : "hover:bg-gray-100"}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-300"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Badge className={`absolute top-4 left-4 ${product.badgeColor} text-white`}>{product.badge}</Badge>
                </div>

                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{product.category}</div>
                  <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-black">R {product.price.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Link href={product.link}>
                      <Button className="w-full bg-black hover:bg-gray-800 text-white">View Details</Button>
                    </Link>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className="flex-1 hover:bg-black hover:text-white bg-transparent"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`hover:bg-gray-100 bg-transparent ${
                          isInWishlist(product.id) ? "text-red-500 border-red-500" : ""
                        }`}
                        onClick={() => handleAddToWishlist(product)}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}

        {/* Custom Embroidery Information */}
        <div className="mt-16 bg-gray-50 p-12 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black mb-4">Custom Embroidery Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We specialize in high-quality embroidery for Wits social clubs, organizations, and teams. Get your custom
              design professionally embroidered on premium merchandise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="bg-black text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Designs</h3>
              <p className="text-gray-600">
                Bring your club logo, organization emblem, or custom design to life with professional embroidery
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shirt className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Materials</h3>
              <p className="text-gray-600">
                Premium fabrics and materials ensure your custom merchandise looks professional and lasts long
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Service</h3>
              <p className="text-gray-600">
                Our experienced team ensures every piece meets the highest standards of quality and craftsmanship
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">Get Custom Quote</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="px-8 py-3 hover:bg-gray-100 bg-transparent">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
