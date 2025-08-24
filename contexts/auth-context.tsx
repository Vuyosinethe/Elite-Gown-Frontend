"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { AuthApiError } from "@supabase/supabase-js"

type User = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
  ) => Promise<{ error: any }>
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<{ error: any }>
  signOut: () => Promise<void>
  forgotPassword: (email: string) => Promise<{ error: any }>
  resetPassword: (password: string) => Promise<{ error: any }>
  updateProfile: (data: Partial<User>) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
  resendConfirmationEmail: (email: string) => Promise<{ error: AuthApiError | null }>
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
        console.log("Profile not found, creating from auth metadata:", profileError)

        // Create user data from auth metadata
        userData = {
          id: authUser.id,
          email: authUser.email,
          firstName: authUser.user_metadata?.first_name || "User",
          lastName: authUser.user_metadata?.last_name || "",
          phone: authUser.user_metadata?.phone || "",
          avatar: authUser.user_metadata?.avatar_url || "",
        }

        // Try to create the missing profile
        try {
          console.log("Creating missing profile for authenticated user")
          const { error: createError } = await supabase.from("profiles").insert({
            id: authUser.id,
            email: authUser.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            avatar_url: userData.avatar,
            created_at: new Date().toISOString(),
          })

          if (createError) {
            console.error("Failed to create profile:", createError)
            // Continue anyway - we have the user data from metadata
          } else {
            console.log("Successfully created missing profile")
          }
        } catch (createError) {
          console.error("Exception creating profile:", createError)
          // Continue anyway - we have the user data from metadata
        }
      } else {
        console.log("Profile data found:", profile)

        userData = {
          id: authUser.id,
          email: authUser.email,
          firstName: profile.first_name || authUser.user_metadata?.first_name || "User",
          lastName: profile.last_name || authUser.user_metadata?.last_name || "",
          phone: profile.phone || authUser.user_metadata?.phone || "",
          avatar: profile.avatar_url || authUser.user_metadata?.avatar_url || "",
        }
      }

      console.log("Setting user data:", userData)
      setUser(userData)
    } catch (error) {
      console.error("Error loading user profile:", error)

      // Final fallback - use auth data
      setUser({
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.user_metadata?.first_name || "User",
        lastName: authUser.user_metadata?.last_name || "",
        phone: authUser.user_metadata?.phone || "",
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
  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone: string) => {
    try {
      console.log("Starting signup process for:", email, "with names:", firstName, lastName, "phone:", phone)

      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("⚠️ Supabase environment variables not configured. Using mock authentication.")
        setTimeout(() => {
          setUser({
            id: "mock-id",
            email,
            firstName,
            lastName,
            phone,
          })
          router.push("/account")
        }, 1000)
        return { error: null }
      }

      // Create user in Supabase Auth with metadata and email confirmation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            full_name: `${firstName} ${lastName}`,
          },
        },
      })

      if (error) {
        console.error("Supabase auth signup error:", error)
        return { error: { message: error.message } }
      }

      console.log("Auth signup successful for:", data.user?.email)

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
            phone: "",
          })
          router.push("/account")
        }, 1000)
        return { error: null }
      }

      // Just attempt the login directly - let Supabase handle the validation
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Supabase auth signin error:", error)

        // Check if it's an invalid credentials error
        if (error.message.includes("Invalid login credentials")) {
          // For invalid credentials, we should assume it's a wrong password
          // rather than checking the profiles table, since the user might exist
          // in auth but not have a profile record yet
          return { error: { message: "Incorrect email or password. Please try again." } }
        }

        // For other types of errors (email not confirmed, etc.)
        if (error.message.includes("Email not confirmed")) {
          return { error: { message: "Please check your email and click the confirmation link before signing in." } }
        }

        // For any other auth errors, return the original message
        return { error: { message: error.message } }
      }

      console.log("Auth signin successful for:", data.user?.email)

      // The auth state change listener will handle loading the profile
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
        phone: data.phone || user.phone,
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
          phone: data.phone,
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

  // Resend confirmation email
  const resendConfirmationEmail = async (email: string) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return { error: { message: "Email confirmation unavailable in mock mode." } }
    }
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    })
    return { error }
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
        resendConfirmationEmail,
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
