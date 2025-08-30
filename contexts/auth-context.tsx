"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { User, Session, AuthError } from "@supabase/supabase-js"
import { supabase, type Profile } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
  emailConfirmed?: boolean
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
  ) => Promise<{ error: AuthError | null; needsConfirmation?: boolean }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ error: any }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()

  // Memoized function to load user with profile
  const loadUserWithProfile = useCallback(async (authUser: User) => {
    try {
      console.log("Loading user profile for:", authUser.id)

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
          emailConfirmed: authUser.email_confirmed_at !== null,
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
          emailConfirmed: authUser.email_confirmed_at !== null,
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
          emailConfirmed: authUser.email_confirmed_at !== null,
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
        emailConfirmed: authUser.email_confirmed_at !== null,
      })
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    // Get initial session immediately
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session...")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        console.log("Initial session result:", { session: !!session, error })

        if (!mounted) return

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
        if (mounted) {
          setUser(null)
          setProfile(null)
          setSession(null)
        }
      } finally {
        if (mounted) {
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
      if (!mounted) return

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
      mounted = false
      subscription.unsubscribe()
    }
  }, [loadUserWithProfile, initialized])

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
    try {
      console.log("Attempting sign up for:", email)

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
        console.error("Sign up error:", error)
        return { error }
      }

      console.log("Sign up result:", { user: !!data?.user, session: !!data?.session })

      // Check if email confirmation is required
      if (data?.user && !data?.session) {
        console.log("Email confirmation required")
        return { error: null, needsConfirmation: true }
      }

      return { error: null }
    } catch (error) {
      console.error("Sign up exception:", error)
      return { error: error as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Sign in result:", { user: !!data?.user, error })

      if (error) {
        console.error("Sign in error:", error)
        return { error }
      }

      if (data?.user) {
        console.log("Sign in successful, user:", data.user.id)
        // The auth state change listener will handle the user state update
        return { error: null }
      }

      return { error: new Error("Unknown sign in error") as AuthError }
    } catch (error) {
      console.error("Sign in exception:", error)
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      console.log("Signing out...")
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
      console.log("Requesting password reset for:", email)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.error("Password reset error:", error)
      }

      return { error }
    } catch (error) {
      console.error("Password reset exception:", error)
      return { error: error as AuthError }
    }
  }

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) {
      return { error: new Error("No user logged in") }
    }

    try {
      console.log("Updating profile for user:", user.id)

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

      const { error } = await supabase.from("profiles").update(dbUpdates).eq("id", user.id)

      if (error) {
        console.error("Profile update error:", error)
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
      console.error("Profile update exception:", error)
      return { error }
    }
  }

  const refreshSession = async () => {
    try {
      console.log("Refreshing session...")
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error("Session refresh error:", error)
        return
      }

      if (data?.session?.user) {
        setSession(data.session)
        await loadUserWithProfile(data.session.user)
      }
    } catch (error) {
      console.error("Session refresh exception:", error)
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
    refreshSession,
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
