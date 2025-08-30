"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({ children, requireAuth = true, redirectTo = "/login", fallback }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Store the current URL for redirect after login
        localStorage.setItem("redirectAfterLogin", window.location.pathname)
        router.push(redirectTo)
      } else if (!requireAuth && user) {
        // User is logged in but shouldn't be (e.g., on login page)
        router.push("/account")
      }
    }
  }, [user, loading, requireAuth, redirectTo, router])

  // Show loading state
  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      )
    )
  }

  // Show content based on auth requirements
  if (requireAuth && !user) {
    return null // Will redirect
  }

  if (!requireAuth && user) {
    return null // Will redirect
  }

  return <>{children}</>
}
