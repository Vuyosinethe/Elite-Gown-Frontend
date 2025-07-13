"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
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
  const [loading, setLoading] = useState(true) // Initial loading state is true
  const router = useRouter()

  // Memoized function to load user with profile
  const loadUserWithProfile = useCallback(async (authUser: User) => {
    console.log("AuthContext: Loading user profile for user ID:", authUser.id)
    try {
      // Fetch profile from database
      const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is fine if profile doesn't exist yet
        console.error("AuthContext: Error fetching profile:", error)
        // Use auth user data as fallback
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          firstName: authUser.user_metadata?.first_name || "",
          lastName: authUser.user_metadata?.last_name || "",
          phone: authUser.user_metadata?.phone || "",
          avatar: authUser.user_metadata?.avatar_url || "",
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
        })
        console.log("AuthContext: Profile loaded successfully for user ID:", authUser.id)
      } else {
        // No profile found, use auth user data
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          firstName: authUser.user_metadata?.first_name || "",
          lastName: authUser.user_metadata?.last_name || "",
          phone: authUser.user_metadata?.phone || "",
          avatar: authUser.user_metadata?.avatar_url || "",
        })
        setProfile(null)
        console.log("AuthContext: No profile found, using auth user data for user ID:", authUser.id)
      }
    } catch (error) {
      console.error("AuthContext: Error loading user profile:", error)
      // Fallback to auth user data
      setUser({
        id: authUser.id,
        email: authUser.email || "",
        firstName: authUser.user_metadata?.first_name || "",
        lastName: authUser.user_metadata?.last_name || "",
        phone: authUser.user_metadata?.phone || "",
        avatar: authUser.user_metadata?.avatar_url || "",
      })
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    console.log("AuthContext: useEffect mounted, initial loading state:", loading)

    // Get initial session immediately without timeout
    const getInitialSession = async () => {
      try {
        console.log("AuthContext: Calling supabase.auth.getSession()...")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        console.log("AuthContext: supabase.auth.getSession() returned.")

        if (!mounted) {
          console.log("AuthContext: Component unmounted during initial session fetch.")
          return
        }

        console.log("AuthContext: Initial session result:", { session: !!session, error })

        if (session?.user) {
          console.log("AuthContext: Found valid session, loading user profile...")
          setSession(session)
          await loadUserWithProfile(session.user)
        } else {
          console.log("AuthContext: No valid session found.")
          setUser(null)
          setProfile(null)
          setSession(null)
        }
      } catch (error) {
        console.error("AuthContext: Error getting initial session:", error)
        if (mounted) {
          setUser(null)
          setProfile(null)
          setSession(null)
        }
      } finally {
        // Ensure loading is set to false regardless of success or failure
        if (mounted) {
          console.log("AuthContext: Initial session check complete. Setting loading to false.")
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) {
        console.log("AuthContext: Component unmounted during auth state change.")
        return
      }

      console.log("AuthContext: Auth state change event:", event, "User ID:", session?.user?.id)

      // Handle different auth events
      if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
        setSession(null)
        console.log("AuthContext: User signed out.")
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          setSession(session)
          await loadUserWithProfile(session.user)
          console.log("AuthContext: User signed in or token refreshed.")
        }
      } else if (event === "USER_UPDATED") {
        if (session?.user) {
          setSession(session)
          await loadUserWithProfile(session.user)
          console.log("AuthContext: User profile updated.")
        }
      }
      // After any auth state change, ensure loading is false if it was true
      // This handles cases where a sign-in/out might have kept it true.
      if (loading) {
        console.log("AuthContext: Auth state changed, ensuring loading is false.")
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
      console.log("AuthContext: useEffect cleanup, subscription unsubscribed.")
    }
  }, [loadUserWithProfile, loading]) // Added 'loading' to dependencies to ensure effect reacts to its changes

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
    try {
      console.log("AuthContext: Attempting sign up for:", email)
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
        console.error("AuthContext: Sign up error:", error)
        return { error }
      }
      console.log("AuthContext: Sign up successful for:", email)
      return { error: null }
    } catch (error) {
      console.error("AuthContext: Sign up exception:", error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log("AuthContext: Attempting sign in for:", email)
      setLoading(true) // Set loading true during sign-in attempt
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("AuthContext: Sign in result:", { user: !!data?.user, error })

      if (error) {
        console.error("AuthContext: Sign in error:", error)
        setLoading(false) // Set loading false on error
        return { error }
      }

      if (data?.user) {
        console.log("AuthContext: Sign in successful, user:", data.user.id)
        // The auth state change listener will handle loading user profile and setting loading to false
        return { error: null }
      }

      setLoading(false) // Fallback in case of unknown error without user
      return { error: new Error("Unknown sign in error") }
    } catch (error) {
      console.error("AuthContext: Sign in exception:", error)
      setLoading(false) // Set loading false on exception
      return { error }
    }
  }

  const signOut = async () => {
    try {
      console.log("AuthContext: Attempting sign out.")
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("AuthContext: Error signing out:", error)
      }
      // Clear local state immediately
      setUser(null)
      setProfile(null)
      setSession(null)
      console.log("AuthContext: User signed out locally, redirecting.")
      router.push("/")
    } catch (error) {
      console.error("AuthContext: Error signing out:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      console.log("AuthContext: Attempting password reset for:", email)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.error("AuthContext: Reset password error:", error)
      } else {
        console.log("AuthContext: Reset password email sent to:", email)
      }
      return { error }
    } catch (error) {
      console.error("AuthContext: Reset password exception:", error)
      return { error }
    }
  }

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) {
      console.warn("AuthContext: No user logged in to update profile.")
      return { error: new Error("No user logged in") }
    }

    try {
      console.log("AuthContext: Attempting to update profile for user ID:", user.id, updates)
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
        console.error("AuthContext: Error updating profile in DB:", error)
        return { error }
      }

      // Refresh user and profile data
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (authUser) {
        await loadUserWithProfile(authUser)
        console.log("AuthContext: Profile updated and reloaded successfully.")
      } else {
        console.warn("AuthContext: User not found after profile update, cannot reload profile.")
      }

      return { error: null }
    } catch (error) {
      console.error("AuthContext: Update profile exception:", error)
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
