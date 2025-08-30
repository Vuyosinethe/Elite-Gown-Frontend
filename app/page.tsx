"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Heart, ShoppingCart, User, Menu, ChevronDown, Star } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/auth-context"
import CartDrawer from "@/components/cart-drawer"
import MobileMenu from "@/components/mobile-menu"

export default function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSaleDropdownOpen, setIsSaleDropdownOpen] = useState(false)
  const { cartCount, addToCart } = useCart()
  const { user, signOut } = useAuth()

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Graduation Gown",
      price: 899.99,
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 124,
      category: "Graduation Gowns",
    },
    {
      id: 2,
      name: "Medical Scrubs Set",
      price: 299.99,
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 89,
      category: "Medical Scrubs",
    },
    {
      id: 3,
      name: "Embroidered Lab Coat",
      price: 199.99,
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 56,
      category: "Lab Coats",
    },
    {
      id: 4,
      name: "Academic Hood",
      price: 149.99,
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 34,
      category: "Academic Accessories",
    },
  ]

  const handleAddToCart = async (product: any) => {
    await addToCart({
      id: product.id,
      name: product.name,
      details: product.category,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/elite-gowns-logo.png" alt="Elite Gowns" width={40} height={40} className="h-10 w-10" />
              <span className="text-xl font-bold text-orange-500">Elite Gowns</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-black font-medium">
                Home
              </Link>

              {/* Sale Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSaleDropdownOpen(!isSaleDropdownOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium"
                >
                  <span>Sale</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isSaleDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    <div className="p-2">
                      <Link
                        href="/graduation-gowns"
                        className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded"
                      >
                        Graduation Gowns
                      </Link>
                      <Link
                        href="/medical-scrubs"
                        className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded"
                      >
                        Medical Scrubs
                      </Link>
                      <Link
                        href="/embroidered-merchandise"
                        className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded"
                      >
                        Embroidered Merchandise
                      </Link>
                      <Link
                        href="/products?category=caps"
                        className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded"
                      >
                        Graduation Caps
                      </Link>
                      <Link
                        href="/products?category=accessories"
                        className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded"
                      >
                        Academic Accessories
                      </Link>
                      <Link
                        href="/products?category=lab-coats"
                        className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded"
                      >
                        Lab Coats
                      </Link>
                      <Link
                        href="/products?category=nursing"
                        className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded"
                      >
                        Nursing Uniforms
                      </Link>
                      <Link
                        href="/products?category=surgical"
                        className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-600 rounded"
                      >
                        Surgical Scrubs
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/about" className="text-gray-700 hover:text-black font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-black font-medium">
                Contact
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-black text-white">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {user ? (
                <div className="flex items-center space-x-2">
                  <Link href="/account">
                    <Button variant="ghost" size="sm">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-black text-white">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-orange-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Premium Academic & Medical Apparel</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our collection of high-quality graduation gowns, medical scrubs, and embroidered merchandise for
            professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Shop Now
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our most popular items, carefully selected for quality and style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">R{product.price.toFixed(2)}</span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you need for your profession</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/graduation-gowns" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Graduation Gowns</h3>
                  <p className="text-gray-600">Premium academic regalia for your special day</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/medical-scrubs" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl">🏥</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Medical Scrubs</h3>
                  <p className="text-gray-600">Comfortable and professional medical wear</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/embroidered-merchandise" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Embroidered Items</h3>
                  <p className="text-gray-600">Custom embroidery for a personal touch</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/elite-gowns-logo.png" alt="Elite Gowns" width={32} height={32} className="h-8 w-8" />
                <span className="text-xl font-bold text-orange-500">Elite Gowns</span>
              </div>
              <p className="text-gray-400">
                Premium academic and medical apparel for professionals who demand quality.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/graduation-gowns" className="hover:text-white">
                    Graduation Gowns
                  </Link>
                </li>
                <li>
                  <Link href="/medical-scrubs" className="hover:text-white">
                    Medical Scrubs
                  </Link>
                </li>
                <li>
                  <Link href="/embroidered-merchandise" className="hover:text-white">
                    Embroidered Items
                  </Link>
                </li>
                <li>
                  <Link href="/rental" className="hover:text-white">
                    Rental Services
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@elitegowns.co.za</li>
                <li>📞 +27 11 123 4567</li>
                <li>📍 Johannesburg, South Africa</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Elite Gowns. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </div>
  )
}
