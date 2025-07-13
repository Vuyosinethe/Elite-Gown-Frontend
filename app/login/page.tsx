"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { ChevronDown, User, X, Menu, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import Layout from "@/components/layout"
import CartDrawer from "@/components/cart-drawer"

export default function LoginPage() {
  const { signIn, loading: authLoading, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cartCount, addPendingCartItem } = useCart()
  const { addPendingWishlistItem } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [formInitialized, setFormInitialized] = useState(false)
  const mountedRef = useRef(true)

  // Admin credentials for quick testing (DO NOT USE IN PRODUCTION)
  const ADMIN_EMAIL = "admin@example.com"
  const ADMIN_PASSWORD = "password" // Replace with a strong password in a real scenario

  // Initialize form state properly on mount and navigation
  useEffect(() => {
    mountedRef.current = true

    // Reset form state
    setEmail("")
    setPassword("")
    setShowPassword(false)
    setLoading(false)
    setError("")
    setMessage("")

    // Initialize form immediately
    setFormInitialized(true)

    return () => {
      mountedRef.current = false
    }
  }, []) // Only run on mount

  // Handle URL parameters
  useEffect(() => {
    if (!formInitialized) return

    const verified = searchParams.get("verified")
    const urlMessage = searchParams.get("message")

    if (verified === "true" && urlMessage) {
      setMessage(decodeURIComponent(urlMessage))
    }
  }, [searchParams, formInitialized])

  // Handle user redirect - only redirect if user is authenticated and not loading
  useEffect(() => {
    if (user && !authLoading && formInitialized) {
      console.log("User is authenticated, redirecting to account...")
      // AuthContext handles admin redirection, so we just push to /account for non-admins
      // or let AuthContext redirect to /admin if applicable.
      // No explicit router.push here, as AuthContext's signIn handles it.
    }
  }, [user, authLoading, formInitialized]) // Removed router from dependency array to avoid infinite loop

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formInitialized || loading || authLoading) {
      console.log("Form not ready for submission")
      return
    }

    console.log("Starting login process...")
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (!mountedRef.current) {
        console.log("Component unmounted, aborting login")
        return
      }

      if (error) {
        console.error("Login failed:", error)

        let errorMessage = "Login failed. Please try again."

        if (error.message?.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again."
        } else if (error.message?.includes("Email not confirmed")) {
          errorMessage = "Please check your email and click the confirmation link before signing in."
        } else if (error.message) {
          errorMessage = error.message
        }

        setError(errorMessage)
        setLoading(false)
      } else {
        console.log("Login successful, handling post-login actions...")

        // Success - handle pending items
        try {
          addPendingCartItem()
          addPendingWishlistItem()
        } catch (err) {
          console.warn("Error adding pending items:", err)
        }

        // AuthContext's signIn already handles redirection based on role.
        // No need for additional redirect logic here.
      }
    } catch (err) {
      console.error("Login exception:", err)
      if (mountedRef.current) {
        setError("An unexpected error occurred. Please try again.")
        setLoading(false)
      }
    }
  }

  const handleFillAdminCredentials = () => {
    setEmail(ADMIN_EMAIL)
    setPassword(ADMIN_PASSWORD)
  }

  // Determine if button should be disabled
  const isButtonDisabled = !formInitialized || loading || authLoading || !email.trim() || !password.trim()

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
                    className="text-gray-700 hover:text-black transition-colors"
                  >
                    {user ? `Cart (${cartCount})` : "Cart"}
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
                  {user ? `Cart (${cartCount})` : "Cart"}
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

        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
              <p className="mt-2 text-center text-sm text-gray-600">Welcome back to Elite Gowns</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sign in to Elite Gowns</CardTitle>
                <CardDescription>Enter your email and password to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                {message && (
                  <div className="mb-4 rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">{message}</p>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Sign In Error</h3>
                        <div className="mt-2 text-sm text-red-700">{error}</div>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                      placeholder="Email address"
                      disabled={!formInitialized || loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                        disabled={!formInitialized || loading}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={!formInitialized || loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      disabled={isButtonDisabled}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Signing in..." : "Sign in"}
                    </Button>
                  </div>

                  <div className="text-center">
                    <span className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link href="/register" className="font-medium text-blue-600 hover:underline">
                        Sign up here
                      </Link>
                    </span>
                  </div>
                </form>
                <div className="mt-4">
                  <Button
                    onClick={handleFillAdminCredentials}
                    className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
                    disabled={!formInitialized || loading}
                  >
                    Fill Admin Credentials (for testing)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cart Drawer */}
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </Layout>
  )
}
