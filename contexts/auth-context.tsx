"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { createClientComponentClient, type Session, type User } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase" // Corrected import path

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string | null
  role: string | null
}

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  fetchUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabaseClient = createClientComponentClient()

  const fetchUserProfile = useCallback(
    async (userId?: string) => {
      if (!userId && !user?.id) return

      const currentUserId = userId || user?.id

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, email, role")
        .eq("id", currentUserId)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
        setProfile(null)
      } else if (data) {
        setProfile(data)
      }
    },
    [user?.id],
  )

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession)
      setUser(currentSession?.user || null)
      setLoading(false)

      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id)
        // Redirect admin users to the admin dashboard
        if (profile?.role === "admin" && window.location.pathname !== "/admin") {
          router.push("/admin")
        } else if (profile?.role !== "admin" && window.location.pathname === "/admin") {
          // Redirect non-admin users away from admin page
          router.push("/account")
        }
      } else {
        setProfile(null)
        // If user logs out from admin page, redirect to login
        if (window.location.pathname === "/admin") {
          router.push("/login")
        }
      }
    })

    // Initial session check
    supabaseClient.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      setSession(initialSession)
      setUser(initialSession?.user || null)
      setLoading(false)
      if (initialSession?.user) {
        await fetchUserProfile(initialSession.user.id)
      }
    })

    return () => {
      authListener.unsubscribe()
    }
  }, [supabaseClient, router, fetchUserProfile, profile?.role]) // Added profile.role to dependencies

  const signOut = useCallback(async () => {
    setLoading(true)
    const { error } = await supabaseClient.auth.signOut()
    if (error) {
      console.error("Error signing out:", error)
    } else {
      setSession(null)
      setUser(null)
      setProfile(null)
      router.push("/login") // Redirect to login after sign out
    }
    setLoading(false)
  }, [supabaseClient, router])

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
