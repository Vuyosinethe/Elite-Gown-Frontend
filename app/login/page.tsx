"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Layout from "@/components/layout"
import CartDrawer from "@/components/cart-drawer"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const { signIn, user, initialized } = useAuth()
  const router = useRouter()
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (initialized && user) {
      router.push("/account")
    }
  }, [user, initialized, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSigningIn(true)

    if (!email || !password) {
      setError("Please enter both email and password.")
      setIsSigningIn(false)
      return
    }

    const { error: signInError } = await signIn(email, password)

    if (!mountedRef.current) return // Prevent state update if component unmounted

    setIsSigningIn(false)
    if (signInError) {
      setError(signInError)
    }
    // Redirection is handled by the AuthContext on successful sign-in
  }

  const isFormReady = initialized && !isSigningIn && email.length > 0 && password.length > 0

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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
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
                  <Link href="/cart" className="text-gray-700 hover:text-black transition-colors">
                    Cart
                  </Link>
                  {user ? (
                    <Link
                      href="/account"
                      className="flex items-center space-x-2 text-gray-700 hover:text-black transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm0 0v1.5a2.5 2.5 0 005 0V7a2.5 2.5 0 00-5 0z"
                        ></path>
                      </svg>
                      <span>{user.firstName}</span>
                    </Link>
                  ) : (
                    <Link href="/login" className="text-gray-700 hover:text-black transition-colors">
                      Sign In
                    </Link>
                  )}
                </div>
              </div>

              {/* Mobile Navigation Button */}
              <div className="flex items-center space-x-4 md:hidden">
                <Link href="/cart" className="text-gray-700 hover:text-black transition-colors">
                  Cart
                </Link>
                <Link href="/login" className="text-gray-700 hover:text-black transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
              <p className="mt-2 text-center text-sm text-gray-600">Welcome back to Elite Gowns</p>
            </div>

            <div className="mt-8 space-y-6">
              {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-md shadow-sm">
                  <div>
                    <Label htmlFor="email-address" className="sr-only">
                      Email address
                    </Label>
                    <Input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSigningIn}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSigningIn}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    disabled={!isFormReady || isSigningIn}
                  >
                    {isSigningIn ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Cart Drawer */}
        <CartDrawer />
      </div>
    </Layout>
  )
}
