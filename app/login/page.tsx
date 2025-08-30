"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import Layout from "@/components/layout"
import { AuthGuard } from "@/components/auth-guard"

export default function LoginPage() {
  const { signIn, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addPendingCartItem } = useCart()
  const { addPendingWishlistItem } = useWishlist()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [formInitialized, setFormInitialized] = useState(false)
  const mountedRef = useRef(true)

  // Initialize form state properly on mount
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
  }, [])

  // Handle URL parameters
  useEffect(() => {
    if (!formInitialized) return

    const verified = searchParams.get("verified")
    const urlMessage = searchParams.get("message")

    if (verified === "true" && urlMessage) {
      setMessage(decodeURIComponent(urlMessage))
    }
  }, [searchParams, formInitialized])

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

        // Handle specific Supabase errors
        let errorMessage = "Login failed. Please try again."

        if (error.message?.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again."
        } else if (error.message?.includes("Email not confirmed")) {
          errorMessage = "Please check your email and click the confirmation link before signing in."
        } else if (error.message?.includes("Too many requests")) {
          errorMessage = "Too many login attempts. Please wait a moment and try again."
        } else if (error.message?.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address."
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

        // Handle redirect
        const redirectUrl = localStorage.getItem("redirectAfterLogin")
        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin")
          console.log("Redirecting to stored URL:", redirectUrl)
          router.push(redirectUrl)
        } else {
          console.log("Redirecting to account page")
          router.push("/account")
        }

        // Don't set loading to false here since we're redirecting
      }
    } catch (err) {
      console.error("Login exception:", err)
      if (mountedRef.current) {
        setError("An unexpected error occurred. Please try again.")
        setLoading(false)
      }
    }
  }

  // Determine if button should be disabled
  const isButtonDisabled = !formInitialized || loading || authLoading || !email.trim() || !password.trim()

  return (
    <AuthGuard requireAuth={false}>
      <Layout>
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
                      placeholder="Email address"
                      disabled={!formInitialized || loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={!formInitialized || loading}
                        className="pr-10"
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
                      className="w-full bg-black hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}
