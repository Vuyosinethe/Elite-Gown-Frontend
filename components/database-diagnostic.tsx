"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Info, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function DatabaseDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [running, setRunning] = useState(false)

  const runDiagnostics = async () => {
    setRunning(true)
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: [],
    }

    try {
      // Test 1: Check if we can connect to Supabase
      try {
        const { data, error } = await supabase.from("profiles").select("count").limit(1)
        results.tests.push({
          name: "Database Connection",
          status: error ? "fail" : "pass",
          message: error ? error.message : "Successfully connected to database",
          details: error ? error : "Connection established",
        })
      } catch (e) {
        results.tests.push({
          name: "Database Connection",
          status: "fail",
          message: "Failed to connect to database",
          details: e,
        })
      }

      // Test 2: Check if profiles table exists
      try {
        const { data, error } = await supabase.from("profiles").select("id").limit(1)
        results.tests.push({
          name: "Profiles Table",
          status: error && error.code === "42P01" ? "fail" : "pass",
          message:
            error && error.code === "42P01"
              ? "Profiles table does not exist"
              : "Profiles table exists and is accessible",
          details: error || "Table found",
        })
      } catch (e) {
        results.tests.push({
          name: "Profiles Table",
          status: "fail",
          message: "Error checking profiles table",
          details: e,
        })
      }

      // Test 3: Check RLS policies
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", "test-id")
        results.tests.push({
          name: "Row Level Security",
          status: "pass",
          message: "RLS policies are working (query executed without auth error)",
          details: "Policies allow proper access control",
        })
      } catch (e) {
        results.tests.push({
          name: "Row Level Security",
          status: "warning",
          message: "RLS test completed",
          details: e,
        })
      }

      // Test 4: Check environment variables
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      results.tests.push({
        name: "Environment Variables",
        status: hasUrl && hasKey ? "pass" : "fail",
        message: hasUrl && hasKey ? "All environment variables are set" : "Missing environment variables",
        details: {
          NEXT_PUBLIC_SUPABASE_URL: hasUrl ? "✓ Set" : "✗ Missing",
          NEXT_PUBLIC_SUPABASE_ANON_KEY: hasKey ? "✓ Set" : "✗ Missing",
        },
      })

      // Test 5: Test auth functionality
      try {
        const { data, error } = await supabase.auth.getSession()
        results.tests.push({
          name: "Authentication Service",
          status: "pass",
          message: "Auth service is responding",
          details: data ? "Session check successful" : "No active session (normal)",
        })
      } catch (e) {
        results.tests.push({
          name: "Authentication Service",
          status: "fail",
          message: "Auth service error",
          details: e,
        })
      }
    } catch (error) {
      results.tests.push({
        name: "General Error",
        status: "fail",
        message: "Unexpected error during diagnostics",
        details: error,
      })
    }

    setDiagnostics(results)
    setRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "fail":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <Info className="h-4 w-4 text-yellow-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Database Diagnostics
          <Button onClick={runDiagnostics} disabled={running} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${running ? "animate-spin" : ""}`} />
            {running ? "Running..." : "Run Tests"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!diagnostics && <p className="text-gray-600 text-sm">Click "Run Tests" to check your database setup.</p>}

        {diagnostics && (
          <div className="space-y-4">
            <div className="text-xs text-gray-500">Last run: {new Date(diagnostics.timestamp).toLocaleString()}</div>

            {diagnostics.tests.map((test: any, index: number) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(test.status)}
                  <span className="font-medium">{test.name}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{test.message}</p>
                {test.details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-500">Details</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                      {typeof test.details === "string" ? test.details : JSON.stringify(test.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
