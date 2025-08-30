"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { CheckCircle, XCircle, AlertCircle, Shield } from "lucide-react"

export function SupabaseConnectionTest() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: any
    warnings?: string[]
  } | null>(null)

  const testConnection = async () => {
    setTesting(true)
    setResult(null)

    try {
      console.log("Testing Supabase connection...")
      const warnings: string[] = []

      // Check if using service role key (security issue)
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (anonKey) {
        try {
          const payload = JSON.parse(atob(anonKey.split(".")[1]))
          if (payload.role === "service_role") {
            warnings.push(
              "🚨 SECURITY WARNING: You're using the service_role key as the anon key! This is a security risk.",
            )
          }
        } catch (e) {
          // Could not decode JWT, might be fine
        }
      }

      // Test 1: Basic connection
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setResult({
          success: false,
          message: "Failed to connect to Supabase",
          details: error,
          warnings,
        })
        return
      }

      // Test 2: Database connection
      const { data: dbTest, error: dbError } = await supabase.from("profiles").select("count").limit(1)

      if (dbError) {
        setResult({
          success: false,
          message: "Connected to auth but database access failed",
          details: dbError,
          warnings,
        })
        return
      }

      setResult({
        success: true,
        message: "Successfully connected to Supabase!",
        details: {
          authConnected: true,
          databaseConnected: true,
          currentSession: !!data.session,
        },
        warnings,
      })
    } catch (error) {
      console.error("Connection test failed:", error)
      setResult({
        success: false,
        message: "Network error - unable to reach Supabase",
        details: error,
      })
    } finally {
      setTesting(false)
    }
  }

  const checkKeyType = (key: string) => {
    try {
      const payload = JSON.parse(atob(key.split(".")[1]))
      return payload.role
    } catch {
      return "unknown"
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>Test your connection to Supabase services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={testing} className="w-full">
          {testing ? "Testing..." : "Test Connection"}
        </Button>

        {result && (
          <div
            className={`p-4 rounded-md ${
              result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                {result.message}
              </span>
            </div>

            {result.warnings && result.warnings.length > 0 && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                {result.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start space-x-2 text-yellow-800">
                    <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{warning}</span>
                  </div>
                ))}
              </div>
            )}

            {result.details && (
              <div className="mt-2 text-sm text-gray-600">
                <pre className="whitespace-pre-wrap">{JSON.stringify(result.details, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>Environment Variables:</span>
          </div>
          <div className="ml-6 space-y-1">
            <div className="flex justify-between">
              <span>SUPABASE_URL:</span>
              <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? "text-green-600" : "text-red-600"}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>SUPABASE_ANON_KEY:</span>
              <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "text-green-600" : "text-red-600"}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing"}
              </span>
            </div>
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && (
              <div className="text-xs text-gray-500">
                Key type: {checkKeyType(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}
                {checkKeyType(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) === "service_role" && (
                  <span className="text-red-600 font-medium"> ⚠️ Should be 'anon'</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
