"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { ChevronDown, User, X, Menu } from "lucide-react"
import Layout from "@/components/layout"
import CartDrawer from "@/components/cart-drawer"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  created_at: string
  total_amount: number
  status: string
  order_items: OrderItem[]
}

async function fetchOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      total_amount,
      status,
      order_items (
        product_id,
        product_name,
        quantity,
        price
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    throw new Error("Failed to fetch orders")
  }

  return data as Order[]
}

export default function AccountPage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [errorOrders, setErrorOrders] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    if (user && !authLoading) {
      setLoadingOrders(true)
      setErrorOrders(null)
      fetchOrders(user.id)
        .then(setOrders)
        .catch((err) => setErrorOrders(err.message))
        .finally(() => setLoadingOrders(false))
    } else if (!user && !authLoading) {
      // If not logged in and auth is done loading, clear orders
      setOrders([])
      setLoadingOrders(false)
    }
  }, [user, authLoading])

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">Loading user data...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You must be logged in to view this page.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">Please sign in to your account.</p>
              <Link href="/login">
                <Button className="w-full">Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
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
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Polo Shirts
                      </Link>
                      <Link
                        href="/embroidered-merchandise?sale=true&type=tshirts"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        T-Shirts
                      </Link>
                      <Link
                        href="/embroidered-merchandise?sale=true&type=hoodies"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
                    className="text-gray-700 hover:text-black transition-colors"
                  >
                    Cart ({cartCount})
                  </button>
                  <Link
                    href="/account"
                    className="flex items-center space-x-2 text-gray-700 hover:text-black transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.firstName}</span>
                  </Link>
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
                  Cart ({cartCount})
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
                <Link
                  href="/account"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
              </div>
            </div>
          )}
        </nav>

        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Welcome, {user.firstName}!</h1>
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Manage your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email:</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Name:</p>
                  <p className="text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                {user.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone:</p>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                )}
                <Button variant="outline" className="w-full bg-transparent">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Order History Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View your past orders.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="text-center py-4">Loading orders...</div>
                ) : errorOrders ? (
                  <div className="text-center py-4 text-red-600">Error: {errorOrders}</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-4 text-gray-600">You have no past orders.</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Order #{order.id.substring(0, 8)}</CardTitle>
                          <div className="text-xs text-gray-500">{format(new Date(order.created_at), "PPP")}</div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold mb-2">${order.total_amount.toFixed(2)}</div>
                          <p className="text-xs text-gray-500 mb-4">Status: {order.status}</p>
                          <h3 className="text-md font-semibold mb-2">Items:</h3>
                          <ul className="space-y-2">
                            {order.order_items.map((item, index) => (
                              <li key={index} className="flex justify-between text-sm text-gray-700">
                                <span>
                                  {item.quantity} x {item.product_name}
                                </span>
                                <span>${(item.quantity * item.price).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Cart Drawer */}
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </Layout>
  )
}
