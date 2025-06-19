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
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()

  // Function to load user profile data
  const loadUserProfile = async (authUser: any) => {
    try {
      console.log("Loading profile for user:", authUser.id, authUser.email)

      // Try to get profile from profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single()

      let userData: User

      if (profileError || !profile) {
        console.log("Profile fetch error or no profile:", profileError)

        // Fallback to auth metadata
        userData = {
          id: authUser.id,
          email: authUser.email,
          firstName: authUser.user_metadata?.first_name || "User",
          lastName: authUser.user_metadata?.last_name || "",
          avatar: authUser.user_metadata?.avatar_url || "",
        }

        // Try to create profile if it doesn't exist
        try {
          await supabase.from("profiles").upsert({
            id: authUser.id,
            email: authUser.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            avatar_url: userData.avatar,
            created_at: new Date().toISOString(),
          })
        } catch (upsertError) {
          console.log("Profile upsert failed:", upsertError)
        }
      } else {
        console.log("Profile data found:", profile)

        userData = {
          id: authUser.id,
          email: authUser.email,
          firstName: profile.first_name || authUser.user_metadata?.first_name || "User",
          lastName: profile.last_name || authUser.user_metadata?.last_name || "",
          avatar: profile.avatar_url || authUser.user_metadata?.avatar_url || "",
        }
      }

      console.log("Setting user data:", userData)
      setUser(userData)
    } catch (error) {
      console.error("Error loading user profile:", error)

      // Final fallback
      setUser({
        id: authUser.id,
        email: authUser.email,
        firstName: "User",
        lastName: "",
        avatar: "",
      })
    }
  }

  // Function to refresh profile data
  const refreshProfile = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        await loadUserProfile(authUser)
      }
    } catch (error) {
      console.error("Error refreshing profile:", error)
    }
  }

  // Check for active session on mount
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...")

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Session check error:", error)
        }

        if (mounted) {
          if (session?.user) {
            console.log("Found existing session for:", session.user.email)
            await loadUserProfile(session.user)
          } else {
            console.log("No existing session found")
            setUser(null)
          }

          setLoading(false)
          setInitialized(true)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initializeAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      if (!mounted) return

      try {
        if (event === "SIGNED_OUT" || !session?.user) {
          console.log("User signed out or no session")
          setUser(null)
          setLoading(false)
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          console.log("User signed in or token refreshed")
          await loadUserProfile(session.user)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error handling auth state change:", error)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Sign up with email and password
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log("Starting signup process for:", email, "with names:", firstName, lastName)

      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("⚠️ Supabase environment variables not configured. Using mock authentication.")
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

      // Create user in Supabase Auth with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
          },
        },
      })

      if (error) {
        console.error("Supabase auth signup error:", error)
        return { error: { message: error.message } }
      }

      console.log("Auth signup successful for:", data.user?.email)

      // Ensure profile is created (backup to trigger)
      if (data.user) {
        try {
          const { error: profileError } = await supabase.from("profiles").upsert({
            id: data.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            avatar_url: "",
            created_at: new Date().toISOString(),
          })

          if (profileError) {
            console.error("Profile creation error:", profileError)
          } else {
            console.log("Profile created successfully")
          }
        } catch (profileError) {
          console.error("Profile creation exception:", profileError)
        }
      }

      return { error: null }
    } catch (error) {
      console.error("Signup process failed:", error)
      return { error: { message: "Registration failed. Please try again." } }
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string, rememberMe: boolean) => {
    try {
      console.log("Starting signin process for:", email)

      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("⚠️ Supabase environment variables not configured. Using mock authentication.")
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

      if (error) {
        console.error("Supabase auth signin error:", error)
        return { error: { message: error.message } }
      }

      console.log("Auth signin successful for:", data.user?.email)

      // The auth state change listener will handle loading the profile
      // and redirecting to the account page

      return { error: null }
    } catch (error) {
      console.error("Error signing in:", error)
      return { error: { message: "Login failed. Please check your credentials." } }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setUser(null)
        router.push("/")
        return
      }

      await supabase.auth.signOut()
      // The auth state change listener will handle clearing the user
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Forgot password
  const forgotPassword = async (email: string) => {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("⚠️ Supabase environment variables not configured.")
        return { error: null }
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.error("Password reset error:", error)
        return { error: { message: error.message } }
      }

      return { error: null }
    } catch (error) {
      console.error("Error resetting password:", error)
      return { error: { message: "Password reset failed. Please try again." } }
    }
  }

  // Reset password
  const resetPassword = async (password: string) => {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("⚠️ Supabase environment variables not configured.")
        return { error: null }
      }

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        console.error("Password update error:", error)
        return { error: { message: error.message } }
      }

      return { error: null }
    } catch (error) {
      console.error("Error updating password:", error)
      return { error: { message: "Password update failed. Please try again." } }
    }
  }

  // Update profile
  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("⚠️ Supabase environment variables not configured.")
        setUser((prev) => (prev ? { ...prev, ...data } : null))
        return { error: null }
      }

      if (!user) {
        return { error: { message: "User not authenticated" } }
      }

      const updates = {
        first_name: data.firstName || user.firstName,
        last_name: data.lastName || user.lastName,
        full_name: `${data.firstName || user.firstName} ${data.lastName || user.lastName}`,
        avatar_url: data.avatar || user.avatar,
        updated_at: new Date().toISOString(),
      }

      // Update profile in database
      const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)

      if (error) {
        console.error("Profile update error:", error)
        return { error: { message: error.message } }
      }

      // Also update auth metadata
      await supabase.auth.updateUser({
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          full_name: `${data.firstName} ${data.lastName}`,
        },
      })

      // Update local state
      setUser((prev) => (prev ? { ...prev, ...data } : null))

      return { error: null }
    } catch (error) {
      console.error("Error updating profile:", error)
      return { error: { message: "Profile update failed. Please try again." } }
    }
  }

  // Don't render children until auth is initialized
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
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
        refreshProfile,
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
