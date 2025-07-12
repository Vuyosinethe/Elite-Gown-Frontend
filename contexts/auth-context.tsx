"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase, type Profile } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
  role?: string // Added role
}

interface AuthContextType {
  user: AuthUser | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
  ) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()
  const mountedRef = useRef(false)

  // Memoized function to load user with profile
  const loadUserWithProfile = useCallback(async (authUser: User) => {
    try {
      // Fetch profile from database
      const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found" error
        console.error("Error fetching profile:", error)
        // Use auth user data as fallback
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          firstName: authUser.user_metadata?.first_name || "",
          lastName: authUser.user_metadata?.last_name || "",
          phone: authUser.user_metadata?.phone || "",
          avatar: authUser.user_metadata?.avatar_url || "",
          role: authUser.user_metadata?.role || "user", // Default role
        })
        setProfile(null)
        return
      }

      if (profileData) {
        // Set profile data
        setProfile(profileData)

        // Create user object with profile data
        setUser({
          id: authUser.id,
          email: authUser.email || profileData.email || "",
          firstName: profileData.first_name || authUser.user_metadata?.first_name || "",
          lastName: profileData.last_name || authUser.user_metadata?.last_name || "",
          phone: profileData.phone || authUser.user_metadata?.phone || "",
          avatar: profileData.avatar_url || authUser.user_metadata?.avatar_url || "",
          role: profileData.role || "user", // Use role from profile or default
        })
      } else {
        // No profile found, use auth user data
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          firstName: authUser.user_metadata?.first_name || "",
          lastName: authUser.user_metadata?.last_name || "",
          phone: authUser.user_metadata?.phone || "",
          avatar: authUser.user_metadata?.avatar_url || "",
          role: authUser.user_metadata?.role || "user", // Default role
        })
        setProfile(null)
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
      // Fallback to auth user data
      setUser({
        id: authUser.id,
        email: authUser.email || "",
        firstName: authUser.user_metadata?.first_name || "",
        lastName: authUser.user_metadata?.last_name || "",
        phone: authUser.user_metadata?.phone || "",
        avatar: authUser.user_metadata?.avatar_url || "",
        role: authUser.user_metadata?.role || "user", // Default role
      })
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true

    // Get initial session immediately without timeout
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session...")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        console.log("Initial session result:", { session: !!session, error })

        if (!mountedRef.current) return

        if (session?.user) {
          console.log("Found valid session, loading user profile...")
          setSession(session)
          await loadUserWithProfile(session.user)
        } else {
          console.log("No valid session found")
          setUser(null)
          setProfile(null)
          setSession(null)
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
        if (mountedRef.current) {
          setUser(null)
          setProfile(null)
          setSession(null)
        }
      } finally {
        if (mountedRef.current) {
          console.log("Auth initialization complete")
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return

      console.log("Auth state change:", event, session?.user?.id)

      // Handle different auth events
      if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
        setSession(null)
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          setSession(session)
          await loadUserWithProfile(session.user)
        }
      } else if (event === "USER_UPDATED") {
        if (session?.user) {
          setSession(session)
          await loadUserWithProfile(session.user)
        }
      }

      // Ensure loading is false after any auth event
      if (!initialized) {
        setLoading(false)
        setInitialized(true)
      }
    })

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [loadUserWithProfile, initialized])

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=true&message=Your email has been verified! You can now sign in.`,
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone || "",
          },
        },
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email)
      setLoading(true) // Set loading true when sign-in starts

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Sign in result:", { user: !!data?.user, error })

      if (error) {
        console.error("Sign in error:", error)
        setLoading(false) // Reset loading on error
        return { error }
      }

      if (data?.user) {
        console.log("Sign in successful, user:", data.user.id)
        // Fetch profile to determine redirect path
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          console.error("Error fetching profile after sign-in:", profileError)
          setLoading(false) // Reset loading on profile fetch error
          return { error: profileError }
        }

        if (profileData?.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/account")
        }
        setLoading(false) // Reset loading on successful redirect
        return { error: null }
      }

      setLoading(false) // Reset loading if no user data (shouldn't happen with successful sign-in)
      return { error: new Error("Unknown sign in error") }
    } catch (error) {
      console.error("Sign in exception:", error)
      setLoading(false) // Reset loading on exception
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error)
      }
      // Clear local state immediately
      setUser(null)
      setProfile(null)
      setSession(null)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) {
      return { error: new Error("No user logged in") }
    }

    try {
      // Convert camelCase to snake_case for database
      const dbUpdates: any = {
        updated_at: new Date().toISOString(),
      }

      if (updates.firstName !== undefined) {
        dbUpdates.first_name = updates.firstName
      }
      if (updates.lastName !== undefined) {
        dbUpdates.last_name = updates.lastName
      }
      if (updates.phone !== undefined) {
        dbUpdates.phone = updates.phone
      }
      if (updates.avatar !== undefined) {
        dbUpdates.avatar_url = updates.avatar
      }
      if (updates.role !== undefined) {
        // Allow updating role (for admin use)
        dbUpdates.role = updates.role
      }

      const { error } = await supabase.from("profiles").update(dbUpdates).eq("id", user.id)

      if (error) {
        return { error }
      }

      // Refresh user and profile data
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (authUser) {
        await loadUserWithProfile(authUser)
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Re-export the context so "import { AuthContext } …" works.
export { AuthContext }
