"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  const accessToken = params.get("access_token")

  useEffect(() => {
    if (!accessToken) {
      setError("Invalid or missing token.")
      setLoading(false)
    } else {
      // set session so the user can update their password
      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: params.get("refresh_token") ?? "",
        })
        .finally(() => setLoading(false))
    }
  }, [accessToken, params])

  const handleSave = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    setSuccess(true)
    setTimeout(() => router.push("/login"), 2500)
  }

  if (loading) return <p className="p-8 text-center">Loading…</p>

  if (success) return <p className="p-8 text-center">Password updated! Redirecting you to log in…</p>

  return (
    <main className="mx-auto my-12 max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Choose a new password</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Input
        placeholder="New password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Input
        placeholder="Confirm password"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <Button className="w-full" onClick={handleSave} disabled={loading}>
        Save password
      </Button>
    </main>
  )
}
