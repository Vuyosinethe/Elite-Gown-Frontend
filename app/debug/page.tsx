"use client"

import { SupabaseConnectionTest } from "@/components/supabase-connection-test"
import Layout from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Key, Database, Shield } from "lucide-react"

export default function DebugPage() {
  const checkKeyType = (key: string) => {
    try {
      const payload = JSON.parse(atob(key.split(".")[1]))
      return payload.role
    } catch {
      return "unknown"
    }
  }

  const anonKeyType = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? checkKeyType(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : "missing"

  const hasSecurityIssue = anonKeyType === "service_role"

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Debug Tools</h1>
            <p className="mt-2 text-gray-600">Test your Supabase connection and environment setup</p>
          </div>

          {hasSecurityIssue && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Issue Detected</span>
                </CardTitle>
                <CardDescription className="text-red-700">
                  You're using the service role key as your anon key. This is a security risk!
                </CardDescription>
              </CardHeader>
              <CardContent className="text-red-800">
                <div className="space-y-2">
                  <p>
                    <strong>Problem:</strong> Your NEXT_PUBLIC_SUPABASE_ANON_KEY is actually a service_role key.
                  </p>
                  <p>
                    <strong>Risk:</strong> Service role keys have admin privileges and should never be exposed to the
                    client.
                  </p>
                  <p>
                    <strong>Solution:</strong> Get the correct anon/public key from your Supabase dashboard:
                  </p>
                  <ol className="list-decimal list-inside ml-4 space-y-1">
                    <li>Go to your Supabase project dashboard</li>
                    <li>Navigate to Settings → API</li>
                    <li>Copy the "anon public" key (not the service_role key)</li>
                    <li>Update your NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable</li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <SupabaseConnectionTest />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Environment Check</span>
                </CardTitle>
                <CardDescription>Verify your environment variables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
                    <span
                      className={`text-sm ${process.env.NEXT_PUBLIC_SUPABASE_URL ? "text-green-600" : "text-red-600"}`}
                    >
                      {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                    <div className="text-right">
                      <span
                        className={`text-sm ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "text-green-600" : "text-red-600"}`}
                      >
                        {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing"}
                      </span>
                      {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && (
                        <div className={`text-xs ${anonKeyType === "anon" ? "text-green-600" : "text-red-600"}`}>
                          Type: {anonKeyType}
                          {anonKeyType === "service_role" && " ⚠️"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">SUPABASE_SERVICE_ROLE_KEY:</span>
                    <span
                      className={`text-sm ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "text-green-600" : "text-red-600"}`}
                    >
                      {process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓ Set" : "✗ Missing"}
                    </span>
                  </div>
                </div>

                {process.env.NEXT_PUBLIC_SUPABASE_URL && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <strong className="text-sm">Supabase URL:</strong>
                    <br />
                    <code className="text-xs break-all text-gray-600">{process.env.NEXT_PUBLIC_SUPABASE_URL}</code>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>How to Fix the Key Issue</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Current Issue</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Both your NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are the same service_role
                        key.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Steps to fix:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    <li>
                      Go to your Supabase project: <code>https://zcinxqdqmhcrogdkgseg.supabase.co</code>
                    </li>
                    <li>Click on "Settings" in the sidebar</li>
                    <li>Click on "API" in the settings menu</li>
                    <li>Look for "Project API keys" section</li>
                    <li>
                      Copy the <strong>"anon public"</strong> key (not the service_role key)
                    </li>
                    <li>
                      Update your <code>.env.local</code> file:
                    </li>
                  </ol>
                </div>

                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
                  <div className="text-gray-400"># Your .env.local should look like this:</div>
                  <div>NEXT_PUBLIC_SUPABASE_URL=https://zcinxqdqmhcrogdkgseg.supabase.co</div>
                  <div>
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjaW54cWRxbWhjcm9nZGtnc2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDE1NTMsImV4cCI6MjA2NTgxNzU1M30.ANON_KEY_HERE
                  </div>
                  <div>
                    SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjaW54cWRxbWhjcm9nZGtnc2VnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI0MTU1MywiZXhwIjoyMDY1ODE3NTUzfQ.yP-XlvjAuHlcXBpJYIa2igZAIygHxBP59yoapPpmsqE
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> The anon key will have <code>"role": "anon"</code> in its JWT payload, while
                  the service role key has <code>"role": "service_role"</code>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
