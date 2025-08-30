"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Menu, X, Star, ChevronDown, User } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"

const allProducts = [
  // Graduation Gowns
  {
    id: "grad-gown-1",
    name: "Classic Bachelor Graduation Gown",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg?height=400&width=400&text=Bachelor+Gown",
    rating: 4.8,
    reviews: 124,
    colors: ["Black", "Navy Blue", "Maroon"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Premium quality bachelor graduation gown made from high-grade polyester fabric.",
    features: ["Wrinkle-resistant fabric", "Comfortable fit", "Durable construction", "Easy care"],
    category: "Graduation Gowns",
    inStock: true,
    isOnSale: true,
  },
  {
    id: "grad-gown-2",
    name: "Masters Graduation Gown with Hood",
    price: 449.99,
    originalPrice: 599.99,
    image: "/placeholder.svg?height=400&width=400&text=Masters+Gown",
    rating: 4.9,
    reviews: 89,
    colors: ["Black", "Navy Blue", "Forest Green"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Elegant masters graduation gown with matching hood, perfect for your special day.",
    features: ["Includes matching hood", "Premium fabric", "Traditional design", "Professional finish"],
    category: "Graduation Gowns",
    inStock: true,
    isOnSale: true,
  },
  // Medical Scrubs
  {
    id: "scrub-1",
    name: "Premium Nursing Scrub Set",
    price: 89.99,
    originalPrice: 119.99,
    image: "/placeholder.svg?height=400&width=400&text=Nursing+Scrubs",
    rating: 4.8,
    reviews: 234,
    colors: ["Navy Blue", "Teal", "Wine", "Black", "Royal Blue"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    description: "Comfortable and durable nursing scrub set made from premium cotton blend.",
    features: ["Moisture-wicking fabric", "Multiple pockets", "Fade-resistant", "Easy care"],
    category: "Medical Scrubs",
    inStock: true,
    isOnSale: true,
  },
  {
    id: "scrub-2",
    name: "Surgical Scrub Top",
    price: 45.99,
    originalPrice: 59.99,
    image: "/placeholder.svg?height=400&width=400&text=Surgical+Top",
    rating: 4.7,
    reviews: 189,
    colors: ["Ceil Blue", "Green", "Navy", "Black"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Professional surgical scrub top with modern fit and functionality.",
    features: ["V-neck design", "Side vents", "Chest pocket", "Antimicrobial treatment"],
    category: "Medical Scrubs",
    inStock: true,
    isOnSale: true,
  },
  // Embroidered Merchandise
  {
    id: "embr-1",
    name: "Custom Embroidered Lab Coat",
    price: 129.99,
    originalPrice: 159.99,
    image: "/placeholder.svg?height=400&width=400&text=Embroidered+Lab+Coat",
    rating: 4.9,
    reviews: 67,
    colors: ["White", "Light Blue"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Professional lab coat with custom embroidery options for your name and title.",
    features: ["Custom embroidery", "Premium fabric", "Professional appearance", "Multiple pockets"],
    category: "Embroidered Merchandise",
    inStock: true,
    isOnSale: true,
  },
  {
    id: "embr-2",
    name: "Personalized Medical Polo Shirt",
    price: 49.99,
    originalPrice: 64.99,
    image: "/placeholder.svg?height=400&width=400&text=Medical+Polo",
    rating: 4.6,
    reviews: 143,
    colors: ["Navy", "White", "Light Blue", "Black"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Comfortable polo shirt with personalized embroidery for medical professionals.",
    features: ["Moisture-wicking", "Custom embroidery", "Professional fit", "Easy care"],
    category: "Embroidered Merchandise",
    inStock: true,
    isOnSale: true,
  },
]

export default function ProductsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedProduct, setSelectedProduct] = useState<(typeof allProducts)[0] | null>(null)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")

  const { user } = useAuth()
  const router = useRouter()
  const { cartCount, addItem } = useCart()
  const { wishlistItems, wishlistCount, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const categories = ["All", "Graduation Gowns", "Medical Scrubs", "Embroidered Merchandise"]

  const filteredProducts = allProducts.filter(
    (product) => selectedCategory === "All" || product.category === selectedCategory,
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const handleAddToCart = async (product: (typeof allProducts)[0], color: string, size: string) => {
    await addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color,
      size,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} (${color}, ${size}) has been added to your cart.`,
    })
  }

  const openProductDetail = (product: (typeof allProducts)[0]) => {
    setSelectedProduct(product)
    setSelectedColor(product.colors[0])
    setSelectedSize(product.sizes[2])
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
                  <Link
                    href="/products?sale=true"
                    className="text-gray-700 hover:text-[#39FF14] transition-colors flex items-center space-x-1"
                  >
                    <span>Sale</span>
                    <ChevronDown className="w-4 h-4" />
                  </Link>
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
                className="block px-3 py-2 rounded-md text-base font-medium text-black bg-gray-50"
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Products</h1>
          <p className="text-lg text-muted-foreground">
            Browse our complete collection of professional attire and graduation gowns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                        selectedCategory === category ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-64 object-cover rounded-t-lg"
                      />
                      {product.isOnSale && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>

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
                        <span className="text-sm text-muted-foreground ml-2">({product.reviews})</span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">R{product.price.toFixed(2)}</span>
                          {product.isOnSale && (
                            <span className="text-sm text-muted-foreground line-through">
                              R{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button className="w-full" onClick={() => openProductDetail(product)}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                    ×
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Image
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      width={500}
                      height={500}
                      className="w-full rounded-lg"
                    />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(selectedProduct.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-muted-foreground">({selectedProduct.reviews} reviews)</span>
                      </div>

                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-3xl font-bold">R{selectedProduct.price.toFixed(2)}</span>
                        {selectedProduct.isOnSale && (
                          <span className="text-xl text-muted-foreground line-through">
                            R{selectedProduct.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground mb-4">{selectedProduct.description}</p>
                    </div>

                    {/* Color Selection */}
                    <div>
                      <h4 className="font-semibold mb-2">Color</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-1 border rounded-md text-sm ${
                              selectedColor === color
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div>
                      <h4 className="font-semibold mb-2">Size</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-3 py-2 border rounded-md text-sm ${
                              selectedSize === size
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-semibold mb-2">Features</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {selectedProduct.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Add to Cart */}
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        onClick={() => handleAddToCart(selectedProduct, selectedColor, selectedSize)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>

                      <Button variant="outline" className="w-full bg-transparent">
                        <Heart className="h-4 w-4 mr-2" />
                        Add to Wishlist
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
