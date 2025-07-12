"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase, type Profile } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>
  sendPasswordResetEmail: (email: string) => Promise<{ error: string | null }>
  resetPassword: (accessToken: string, newPassword: string) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()
  const mountedRef = useRef(false)

  const fetchUserProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, role") // Select role
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }
    return data
  }, [])

  useEffect(() => {
    mountedRef.current = true
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session)
      if (!mountedRef.current) return

      if (session) {
        setUser(session.user)
        const userProfile = await fetchUserProfile(session.user.id)
        setProfile(userProfile)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
      setInitialized(true)
    })

    // Initial session check
    const getInitialSession = async () => {
      if (!mountedRef.current) return
      setLoading(true)
      const { data: sessionData, error } = await supabase.auth.getSession()
      if (!mountedRef.current) return

      if (error) {
        console.error("Error getting initial session:", error)
        setUser(null)
        setProfile(null)
      } else if (sessionData?.session) {
        setUser(sessionData.session.user)
        const userProfile = await fetchUserProfile(sessionData.session.user.id)
        setProfile(userProfile)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
      setInitialized(true)
    }

    getInitialSession()

    return () => {
      mountedRef.current = false
      authListener.subscription.unsubscribe()
    }
  }, [fetchUserProfile])

  const signIn = useCallback(
    async (email, password) => {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (!mountedRef.current) return { error: "Component unmounted" }

      setLoading(false)
      if (error) {
        console.error("Sign In Error:", error)
        return { error: error.message }
      }
      // User and profile will be set by onAuthStateChange listener
      router.push("/account") // Redirect to account page on successful login
      return { error: null }
    },
    [router],
  )

  const signUp = useCallback(async (email, password) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      },
    })
    if (!mountedRef.current) return { error: "Component unmounted" }

    setLoading(false)
    if (error) {
      console.error("Sign Up Error:", error)
      return { error: error.message }
    }
    // User will be set by onAuthStateChange listener after email confirmation
    return { error: null }
  }, [])

  const signOut = useCallback(async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (!mountedRef.current) return

    setLoading(false)
    if (error) {
      console.error("Sign Out Error:", error)
    } else {
      setUser(null)
      setProfile(null)
      router.push("/login") // Redirect to login page on sign out
    }
  }, [router])

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      setLoading(true)
      const { error } = await supabase.from("profiles").upsert(updates)
      if (!mountedRef.current) return { error: "Component unmounted" }

      setLoading(false)
      if (error) {
        console.error("Update Profile Error:", error)
        return { error: error.message }
      }
      if (user) {
        const updatedProfile = await fetchUserProfile(user.id)
        setProfile(updatedProfile)
      }
      return { error: null }
    },
    [user, fetchUserProfile],
  )

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })
    if (!mountedRef.current) return { error: "Component unmounted" }

    setLoading(false)
    if (error) {
      console.error("Send Password Reset Email Error:", error)
      return { error: error.message }
    }
    return { error: null }
  }, [])

  const resetPassword = useCallback(async (accessToken: string, newPassword: string) => {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (!mountedRef.current) return { error: "Component unmounted" }

    setLoading(false)
    if (error) {
      console.error("Reset Password Error:", error)
      return { error: error.message }
    }
    return { error: null }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        initialized,
        signIn,
        signUp,
        signOut,
        updateProfile,
        sendPasswordResetEmail,
        resetPassword,
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
