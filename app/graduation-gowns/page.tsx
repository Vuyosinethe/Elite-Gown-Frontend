"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

const graduationGowns = [
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
    category: "Bachelor",
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
    category: "Masters",
    inStock: true,
    isOnSale: true,
  },
  {
    id: "grad-gown-3",
    name: "PhD Doctoral Graduation Gown",
    price: 699.99,
    originalPrice: 899.99,
    image: "/placeholder.svg?height=400&width=400&text=PhD+Gown",
    rating: 5.0,
    reviews: 45,
    colors: ["Black", "Royal Blue", "Scarlet"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Distinguished PhD doctoral gown with velvet trim and full regalia.",
    features: ["Velvet trim details", "Full doctoral regalia", "Luxury fabric", "Custom embroidery available"],
    category: "Doctoral",
    inStock: true,
    isOnSale: true,
  },
  {
    id: "grad-gown-4",
    name: "High School Graduation Gown",
    price: 199.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=400&width=400&text=High+School+Gown",
    rating: 4.7,
    reviews: 203,
    colors: ["Black", "White", "Royal Blue", "Maroon"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Affordable and quality high school graduation gown for your milestone moment.",
    features: ["Budget-friendly", "Quality construction", "Multiple colors", "Easy to wear"],
    category: "High School",
    inStock: true,
    isOnSale: true,
  },
  {
    id: "grad-gown-5",
    name: "University Graduation Gown Set",
    price: 349.99,
    originalPrice: 449.99,
    image: "/placeholder.svg?height=400&width=400&text=University+Set",
    rating: 4.8,
    reviews: 156,
    colors: ["Black", "Navy Blue"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Complete university graduation set including gown, cap, and tassel.",
    features: ["Complete set", "Cap and tassel included", "University approved", "Perfect fit guarantee"],
    category: "University",
    inStock: true,
    isOnSale: true,
  },
  {
    id: "grad-gown-6",
    name: "Premium Silk Graduation Gown",
    price: 899.99,
    originalPrice: 1199.99,
    image: "/placeholder.svg?height=400&width=400&text=Silk+Gown",
    rating: 4.9,
    reviews: 67,
    colors: ["Black", "Midnight Blue"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Luxurious silk graduation gown for the most special occasions.",
    features: ["100% silk fabric", "Luxury finish", "Exceptional quality", "Lifetime keepsake"],
    category: "Premium",
    inStock: true,
    isOnSale: true,
  },
]

export default function GraduationGownsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedProduct, setSelectedProduct] = useState(graduationGowns[0])
  const [selectedColor, setSelectedColor] = useState(selectedProduct.colors[0])
  const [selectedSize, setSelectedSize] = useState(selectedProduct.sizes[2])
  const { addItem } = useCart()
  const { toast } = useToast()

  const categories = ["All", "Bachelor", "Masters", "Doctoral", "High School", "University", "Premium"]

  const filteredGowns = graduationGowns.filter(
    (gown) => selectedCategory === "All" || gown.category === selectedCategory,
  )

  const sortedGowns = [...filteredGowns].sort((a, b) => {
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

  const handleAddToCart = async (product: (typeof graduationGowns)[0], color: string, size: string) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Graduation Gowns</h1>
        <p className="text-lg text-muted-foreground">Celebrate your achievement with our premium graduation gowns</p>
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
            {sortedGowns.map((gown) => (
              <Card key={gown.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={gown.image || "/placeholder.svg"}
                      alt={gown.name}
                      width={400}
                      height={400}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    {gown.isOnSale && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{gown.name}</h3>

                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(gown.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">({gown.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">R{gown.price.toFixed(2)}</span>
                        {gown.isOnSale && (
                          <span className="text-sm text-muted-foreground line-through">
                            R{gown.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => setSelectedProduct(gown)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Product Detail Modal/Section */}
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
                    <div className="flex space-x-2">
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
                    <div className="grid grid-cols-3 gap-2">
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
