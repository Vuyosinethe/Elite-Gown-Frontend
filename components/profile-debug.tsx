"use client"

import { useContext } from "react"
import { AuthContext } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"

/**
 * ProfileDebug
 *
 * Lightweight component that prints the current auth/user object.
 * Helpful while developing to verify that names, email, etc. are
 * coming through correctly from Supabase.
 */
export function ProfileDebug() {
  const { user, loading, error } = useContext(AuthContext)

  if (loading) {
    return <p className="text-sm text-muted-foreground">{"Auth is initializing…"}</p>
  }

  if (error) {
    return <p className="text-sm text-red-600">{`Auth error: ${error.message}`}</p>
  }

  return (
    <Card className="max-w-lg">
      <CardContent className="p-4 overflow-auto">
        <h2 className="text-lg font-semibold mb-2">{"Auth Debug"}</h2>
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(user, null, 2)}</pre>
      </CardContent>
    </Card>
  )
}

/* Optional default export so it can be imported either way */
export default ProfileDebug
