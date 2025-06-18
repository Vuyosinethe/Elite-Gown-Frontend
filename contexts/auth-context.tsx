"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any }>
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<{ error: any }>
  signOut: () => Promise<void>
  forgotPassword: (email: string) => Promise<{ error: any }>
  resetPassword: (password: string) => Promise<{ error: any }>
  updateProfile: (data: Partial<User>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check for active session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (session?.user) {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          setUser({
            id: session.user.id,
            email: session.user.email!,
            firstName: profile?.first_name || "",
            lastName: profile?.last_name || "",
            avatar: profile?.avatar_url || "",
          })
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          setUser({
            id: session.user.id,
            email: session.user.email!,
            firstName: profile?.first_name || "",
            lastName: profile?.last_name || "",
            avatar: profile?.avatar_url || "",
          })
        } catch (error) {
          console.error("Error fetching profile:", error)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign up with email and password
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true)

      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("⚠️ Supabase environment variables not configured. Using mock authentication.")
        // Simulate successful signup with mock data
        setTimeout(() => {
          setUser({
            id: "mock-id",
            email,
            firstName,
            lastName,
          })
          router.push("/account")
        }, 1000)
        return { error: null }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      if (error) throw error

      // Create profile record
      if (data.user) {
        await supabase.from("profiles").insert([
          {
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email,
          },
        ])
      }

      return { error: null }
    } catch (error) {
      console.error("Error signing up:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setLoading(true)

      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("⚠️ Supabase environment variables not configured. Using mock authentication.")
        // Simulate successful login with mock data
        setTimeout(() => {
          setUser({
            id: "mock-id",
            email,
            firstName: "Mock",
            lastName: "User",
          })
          router.push("/account")
        }, 1000)
        return { error: null }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

        setUser({
          id: data.user.id,
          email: data.user.email!,
          firstName: profile?.first_name || "",
          lastName: profile?.last_name || "",
          avatar: profile?.avatar_url || "",
        })

        router.push("/account")
      }

      return { error: null }
    } catch (error) {
      console.error("Error signing in:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)

      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Just clear the mock user
        setUser(null)
        router.push("/")
        return
      }

      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setLoading(false)
    }
  }

  // Forgot password
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true)

      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("⚠️ Supabase environment variables not configured. Using mock authentication.")
        return { error: null }
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error("Error resetting password:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (password: string) => {
    try {
      setLoading(true)

      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("⚠️ Supabase environment variables not configured. Using mock authentication.")
        return { error: null }
      }

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error("Error updating password:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Update profile
  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true)

      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("⚠️ Supabase environment variables not configured. Using mock authentication.")
        // Update mock user
        setUser((prev) => (prev ? { ...prev, ...data } : null))
        return { error: null }
      }

      if (!user) throw new Error("User not authenticated")

      const updates = {
        id: user.id,
        first_name: data.firstName || user.firstName,
        last_name: data.lastName || user.lastName,
        avatar_url: data.avatar || user.avatar,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)

      if (error) throw error

      setUser((prev) => (prev ? { ...prev, ...data } : null))

      return { error: null }
    } catch (error) {
      console.error("Error updating profile:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        forgotPassword,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
