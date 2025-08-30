"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({ children, requireAuth = true, redirectTo = "/login", fallback }: AuthGuardProps) {
  const { user, loading, session } = useAuth()
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    console.log("AuthGuard check:", { user: !!user, loading, requireAuth, session: !!session })

    if (!loading) {
      if (requireAuth && (!user || !session)) {
        console.log("Auth required but user not authenticated, redirecting to:", redirectTo)
        // Store the current URL for redirect after login
        if (typeof window !== "undefined") {
          localStorage.setItem("redirectAfterLogin", window.location.pathname)
        }
        router.replace(redirectTo)
        setShouldRender(false)
      } else if (!requireAuth && user && session) {
        console.log("User authenticated but shouldn't be, redirecting to account")
        router.replace("/account")
        setShouldRender(false)
      } else {
        console.log("Auth check passed, rendering content")
        setShouldRender(true)
      }
    }
  }, [user, loading, requireAuth, redirectTo, router, session])

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

  // Don't render if auth requirements not met
  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  return <>{children}</>
}
