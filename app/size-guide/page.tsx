"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Ruler, User, Heart, ChevronDown } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

export default function SizeGuidePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const { user } = useAuth()

  const graduationSizes = [
    { size: "XS", height: "150-160cm", chest: "80-90cm", weight: "45-55kg" },
    { size: "S", height: "160-170cm", chest: "90-100cm", weight: "55-65kg" },
    { size: "M", height: "170-180cm", chest: "100-110cm", weight: "65-75kg" },
    { size: "L", height: "180-190cm", chest: "110-120cm", weight: "75-85kg" },
    { size: "XL", height: "190-200cm", chest: "120-130cm", weight: "85-95kg" },
    { size: "XXL", height: "200cm+", chest: "130cm+", weight: "95kg+" },
  ]

  const scrubsSizes = [
    { size: "XS", chest: "81-86cm", waist: "66-71cm", hip: "89-94cm" },
    { size: "S", chest: "86-91cm", waist: "71-76cm", hip: "94-99cm" },
    { size: "M", chest: "91-97cm", waist: "76-81cm", hip: "99-104cm" },
    { size: "L", chest: "97-102cm", waist: "81-86cm", hip: "104-109cm" },
    { size: "XL", chest: "102-107cm", waist: "86-91cm", hip: "109-114cm" },
    { size: "XXL", chest: "107-112cm", waist: "91-97cm", hip: "114-119cm" },
  ]

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
                      GRADUATION GOWNS
                    </Link>
                    <Link
                      href="/medical-scrubs"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      MEDICAL SCRUBS
                    </Link>
                    <Link
                      href="/medical-scrubs"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      LAB COATS AND JACKETS
                    </Link>
                    <Link
                      href="/embroidered-merchandise"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      EMBROIDERED MERCHANDISE
                    </Link>
                    <Link
                      href="/products"
                      className="block px-4 py-2 text-sm text-red-600 font-bold hover:bg-gray-50 hover:text-red-700 transition-colors"
                    >
                      SALE
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
                <button onClick={() => setCartOpen(true)} className="text-gray-700 hover:text-black transition-colors">
                  {user ? "Cart (0)" : "Cart"}
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
              <button onClick={() => setCartOpen(true)} className="text-gray-700 hover:text-black transition-colors">
                {user ? "Cart (0)" : "Cart"}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Size Guide</h1>
          <p className="text-xl text-gray-600">Find your perfect fit with our comprehensive sizing charts</p>
        </div>

        {/* Size Guide Tabs */}
        <Tabs defaultValue="graduation" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="graduation">Graduation Gowns</TabsTrigger>
            <TabsTrigger value="scrubs">Medical Scrubs</TabsTrigger>
            <TabsTrigger value="embroidery">Embroidered Items</TabsTrigger>
          </TabsList>

          {/* Graduation Gowns Tab */}
          <TabsContent value="graduation">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Ruler className="w-5 h-5" />
                    <span>Graduation Gown Sizing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Size</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Height</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Chest</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {graduationSizes.map((size, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-6 py-4 font-semibold text-gray-900">{size.size}</td>
                            <td className="px-6 py-4 text-gray-600">{size.height}</td>
                            <td className="px-6 py-4 text-gray-600">{size.chest}</td>
                            <td className="px-6 py-4 text-gray-600">{size.weight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>How to Measure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Height</h4>
                        <p className="text-gray-600 text-sm">
                          Stand straight against a wall without shoes. Measure from the top of your head to the floor.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Chest</h4>
                        <p className="text-gray-600 text-sm">
                          Measure around the fullest part of your chest, keeping the tape measure level and snug but not
                          tight.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Weight</h4>
                        <p className="text-gray-600 text-sm">
                          Use your current weight as a reference. This helps ensure proper draping of the gown.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Fitting Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                        <span>Graduation gowns should have a loose, flowing fit</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                        <span>The gown should reach mid-calf to ankle length</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                        <span>Sleeves should cover your arms completely</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                        <span>If between sizes, choose the larger size</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                        <span>Consider the clothing you'll wear underneath</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Medical Scrubs Tab */}
          <TabsContent value="scrubs">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span>Medical Scrubs Sizing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Size</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Chest</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Waist</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Hip</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scrubsSizes.map((size, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-6 py-4 font-semibold text-gray-900">{size.size}</td>
                            <td className="px-6 py-4 text-gray-600">{size.chest}</td>
                            <td className="px-6 py-4 text-gray-600">{size.waist}</td>
                            <td className="px-6 py-4 text-gray-600">{size.hip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Scrubs Measurement Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Chest/Bust</h4>
                        <p className="text-gray-600 text-sm">
                          Measure around the fullest part of your chest/bust, keeping the tape measure level.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Waist</h4>
                        <p className="text-gray-600 text-sm">
                          Measure around your natural waistline, which is typically the narrowest part of your torso.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Hip</h4>
                        <p className="text-gray-600 text-sm">
                          Measure around the fullest part of your hips, typically 8-10 inches below your waist.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Scrubs Fit Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                        <span>Scrubs should allow for comfortable movement</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                        <span>Not too tight or too loose for professional appearance</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                        <span>Pants should reach the top of your shoes</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                        <span>Sleeves should end at your wrists</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                        <span>Consider shrinkage after washing</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Embroidered Items Tab */}
          <TabsContent value="embroidery">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Embroidered Merchandise Sizing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Polo Shirts & T-Shirts</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">Size</th>
                              <th className="px-4 py-3 text-left font-semibold">Chest</th>
                              <th className="px-4 py-3 text-left font-semibold">Length</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white">
                              <td className="px-4 py-3 font-semibold">S</td>
                              <td className="px-4 py-3">86-91cm</td>
                              <td className="px-4 py-3">66cm</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="px-4 py-3 font-semibold">M</td>
                              <td className="px-4 py-3">91-97cm</td>
                              <td className="px-4 py-3">69cm</td>
                            </tr>
                            <tr className="bg-white">
                              <td className="px-4 py-3 font-semibold">L</td>
                              <td className="px-4 py-3">97-102cm</td>
                              <td className="px-4 py-3">72cm</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="px-4 py-3 font-semibold">XL</td>
                              <td className="px-4 py-3">102-107cm</td>
                              <td className="px-4 py-3">75cm</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-4">Hoodies & Jackets</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">Size</th>
                              <th className="px-4 py-3 text-left font-semibold">Chest</th>
                              <th className="px-4 py-3 text-left font-semibold">Length</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white">
                              <td className="px-4 py-3 font-semibold">S</td>
                              <td className="px-4 py-3">91-97cm</td>
                              <td className="px-4 py-3">63cm</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="px-4 py-3 font-semibold">M</td>
                              <td className="px-4 py-3">97-102cm</td>
                              <td className="px-4 py-3">66cm</td>
                            </tr>
                            <tr className="bg-white">
                              <td className="px-4 py-3 font-semibold">L</td>
                              <td className="px-4 py-3">102-107cm</td>
                              <td className="px-4 py-3">69cm</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="px-4 py-3 font-semibold">XL</td>
                              <td className="px-4 py-3">107-112cm</td>
                              <td className="px-4 py-3">72cm</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cap Sizing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-3">Head Circumference Guide</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Small: 54-56cm</li>
                        <li>• Medium: 56-58cm</li>
                        <li>• Large: 58-60cm</li>
                        <li>• Extra Large: 60-62cm</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">How to Measure</h4>
                      <p className="text-gray-600 text-sm">
                        Measure around your head just above your ears and eyebrows. The tape measure should be snug but
                        not tight. Most of our caps are adjustable to fit a range of head sizes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* General Tips */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">General Sizing Tips</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ruler className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Measure Accurately</h3>
              <p className="text-gray-600 text-sm">
                Use a flexible measuring tape and have someone help you for the most accurate measurements.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Consider Your Build</h3>
              <p className="text-gray-600 text-sm">
                Take into account your body shape and preferred fit when choosing between sizes.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">When in Doubt</h3>
              <p className="text-gray-600 text-sm">
                Contact our customer service team for personalized sizing advice and recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
