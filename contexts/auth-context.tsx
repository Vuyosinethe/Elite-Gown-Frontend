"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase" // Correct import path

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  forgotPassword: (email: string) => Promise<{ error: string | null }>
  resetPassword: (accessToken: string, newPassword: string) => Promise<{ error: string | null }>
  profile: { full_name: string | null; avatar_url: string | null; role: string | null } | null
  profileLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<{
    full_name: string | null
    avatar_url: string | null
    role: string | null
  } | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const fetchUserAndProfile = useCallback(async () => {
    setLoading(true)
    setProfileLoading(true)
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser()
    setUser(sessionUser)

    if (sessionUser) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, role")
        .eq("id", sessionUser.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        setProfile(null)
        setIsAdmin(false)
      } else {
        setProfile(profileData)
        setIsAdmin(profileData?.role === "admin")
      }
    } else {
      setProfile(null)
      setIsAdmin(false)
    }
    setLoading(false)
    setProfileLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchUserAndProfile()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      fetchUserAndProfile() // Re-fetch profile on auth state change
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [fetchUserAndProfile, supabase.auth])

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)

      if (error) {
        console.error("Sign-in error:", error)
        return { error: error.message }
      }

      if (data.user) {
        // Fetch profile immediately after successful sign-in to get role
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          console.error("Error fetching profile after sign-in:", profileError)
          return { error: "Failed to fetch user profile after sign-in." }
        }

        if (profileData?.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/account")
        }
      }
      return { error: null }
    },
    [supabase.auth, router],
  )

  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      const { error } = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (error) {
        console.error("Sign-up error:", error)
        return { error: error.message }
      }
      return { error: null }
    },
    [supabase.auth],
  )

  const signOut = useCallback(async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    setLoading(false)
    if (error) {
      console.error("Sign-out error:", error)
      return { error: error.message }
    }
    setUser(null)
    setProfile(null)
    setIsAdmin(false)
    router.push("/login")
    return { error: null }
  }, [supabase.auth, router])

  const forgotPassword = useCallback(
    async (email: string) => {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      })
      setLoading(false)
      if (error) {
        console.error("Forgot password error:", error)
        return { error: error.message }
      }
      return { error: null }
    },
    [supabase.auth],
  )

  const resetPassword = useCallback(
    async (accessToken: string, newPassword: string) => {
      setLoading(true)
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      setLoading(false)
      if (error) {
        console.error("Reset password error:", error)
        return { error: error.message }
      }
      return { error: null }
    },
    [supabase.auth],
  )

  const value = {
    user,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
    profile,
    profileLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
