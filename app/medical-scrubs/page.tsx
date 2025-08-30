"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

const medicalScrubs = [
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
    category: "Nursing",
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
    category: "Surgical",
    inStock: true,
    isOnSale: true,
  },
  {
    id: "scrub-3",
    name: "Dental Assistant Uniform",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=400&width=400&text=Dental+Uniform",
    rating: 4.9,
    reviews: 156,
    colors: ["White", "Light Blue", "Lavender", "Pink"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Stylish dental assistant uniform with professional appearance.",
    features: ["Wrinkle-resistant", "Stain-resistant", "Comfortable fit", "Professional look"],
    category: "Dental",
    inStock: true,
    isOnSale: true,
  },
  {
    id: "scrub-4",
    name: "Veterinary Scrub Set",
    price: 94.99,
    originalPrice: 124.99,
    image: "/placeholder.svg?height=400&width=400&text=Vet+Scrubs",
    rating: 4.8,
    reviews: 98,
    colors: ["Forest Green", "Navy", "Burgundy", "Black"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Durable veterinary scrub set designed for animal care professionals.",
    features: ["Reinforced seams", "Extra pockets", "Stain-resistant", "Comfortable mobility"],
    category: "Veterinary",
    inStock: true,
    isOnSale: true,
  },
  {
    id: "scrub-5",
    name: "Lab Coat - Professional",
    price: 69.99,
    originalPrice: 89.99,
    image: "/placeholder.svg?height=400&width=400&text=Lab+Coat",
    rating: 4.6,
    reviews: 145,
    colors: ["White", "Light Blue"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    description: "Professional lab coat for medical and laboratory professionals.",
    features: ["Button front", "Multiple pockets", "Knee length", "Easy care fabric"],
    category: "Lab Coats",
    inStock: true,
    isOnSale: true,
  },
  {
    id: "scrub-6",
    name: "Maternity Scrub Top",
    price: 54.99,
    originalPrice: 69.99,
    image: "/placeholder.svg?height=400&width=400&text=Maternity+Scrubs",
    rating: 4.9,
    reviews: 87,
    colors: ["Navy", "Teal", "Wine", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Comfortable maternity scrub top with expandable design.",
    features: ["Expandable sides", "Soft fabric", "Flattering fit", "Easy nursing access"],
    category: "Maternity",
    inStock: true,
    isOnSale: true,
  },
]

export default function MedicalScrubsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedProduct, setSelectedProduct] = useState<(typeof medicalScrubs)[0] | null>(null)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const { addItem } = useCart()
  const { toast } = useToast()

  const categories = ["All", "Nursing", "Surgical", "Dental", "Veterinary", "Lab Coats", "Maternity"]

  const filteredScrubs = medicalScrubs.filter(
    (scrub) => selectedCategory === "All" || scrub.category === selectedCategory,
  )

  const sortedScrubs = [...filteredScrubs].sort((a, b) => {
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

  const handleAddToCart = async (product: (typeof medicalScrubs)[0], color: string, size: string) => {
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

  const openProductDetail = (product: (typeof medicalScrubs)[0]) => {
    setSelectedProduct(product)
    setSelectedColor(product.colors[0])
    setSelectedSize(product.sizes[2])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Medical Scrubs</h1>
        <p className="text-lg text-muted-foreground">Professional medical scrubs for healthcare professionals</p>
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
            {sortedScrubs.map((scrub) => (
              <Card key={scrub.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={scrub.image || "/placeholder.svg"}
                      alt={scrub.name}
                      width={400}
                      height={400}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    {scrub.isOnSale && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{scrub.name}</h3>

                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(scrub.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">({scrub.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">R{scrub.price.toFixed(2)}</span>
                        {scrub.isOnSale && (
                          <span className="text-sm text-muted-foreground line-through">
                            R{scrub.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => openProductDetail(scrub)}>
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
                              i < Math.floor(selectedProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
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
  )
}
