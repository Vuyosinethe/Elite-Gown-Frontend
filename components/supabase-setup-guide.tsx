"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Copy } from "lucide-react"

export function SupabaseSetupGuide() {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const copyEnvExample = () => {
    navigator.clipboard.writeText(`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl">Supabase Setup Required</CardTitle>
        <CardDescription>To enable authentication features, you need to connect your Supabase project</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing environment variables</AlertTitle>
          <AlertDescription>
            The authentication system is currently running in mock mode because Supabase environment variables are not
            configured.
          </AlertDescription>
        </Alert>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={expanded ? "setup" : undefined}
          onValueChange={(val) => setExpanded(!!val)}
        >
          <AccordionItem value="setup">
            <AccordionTrigger>How to set up Supabase</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  Create a free account at{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    supabase.com
                  </a>
                </li>
                <li>Create a new project</li>
                <li>Go to Project Settings → API</li>
                <li>Copy the URL and anon key</li>
                <li>
                  Create a <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file in your project root
                </li>
                <li>
                  Add the following environment variables:
                  <div className="bg-muted p-3 rounded-md mt-2 relative">
                    <pre className="text-sm">
                      NEXT_PUBLIC_SUPABASE_URL=your_supabase_url NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
                    </pre>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={copyEnvExample}>
                      {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </li>
                <li>Restart your development server</li>
                <li>
                  Run the SQL script in{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">scripts/create-user-profiles.sql</code> in your
                  Supabase SQL editor
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setExpanded(!expanded)}>{expanded ? "Hide Setup Guide" : "Show Setup Guide"}</Button>
      </CardFooter>
    </Card>
  )
}
