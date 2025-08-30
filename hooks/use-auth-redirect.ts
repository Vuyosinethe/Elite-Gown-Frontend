"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface UseAuthRedirectOptions {
  requireAuth?: boolean
  redirectTo?: string
  onAuthRequired?: () => void
  onAlreadyAuth?: () => void
}

export function useAuthRedirect({
  requireAuth = true,
  redirectTo = "/login",
  onAuthRequired,
  onAlreadyAuth,
}: UseAuthRedirectOptions = {}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (requireAuth && !user) {
      // Store current URL for redirect after login
      localStorage.setItem("redirectAfterLogin", window.location.pathname)
      onAuthRequired?.()
      router.push(redirectTo)
    } else if (!requireAuth && user) {
      // User is already authenticated
      onAlreadyAuth?.()
      router.push("/account")
    }
  }, [user, loading, requireAuth, redirectTo, router, onAuthRequired, onAlreadyAuth])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    shouldRedirect: requireAuth ? !user : !!user,
  }
}
