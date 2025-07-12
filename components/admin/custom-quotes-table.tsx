"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface CustomQuote {
  id: string
  user_id: string | null
  details: string
  status: "new" | "reviewed" | "quoted" | "accepted" | "rejected"
  created_at: string
  updated_at: string
  profiles: {
    full_name: string | null
    email: string | null
  } | null
}

export function CustomQuotesTable() {
  const [quotes, setQuotes] = useState<CustomQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch("/api/admin/custom-quotes")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch custom quotes")
        }
        const data = await response.json()
        setQuotes(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchQuotes()
  }, [])

  if (loading) return <p>Loading custom quotes...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Quote Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="font-mono text-xs">{quote.id.substring(0, 8)}...</TableCell>
                <TableCell>{quote.profiles?.full_name || "Guest"}</TableCell>
                <TableCell>{quote.profiles?.email || "N/A"}</TableCell>
                <TableCell className="max-w-[200px] truncate">{quote.details}</TableCell>
                <TableCell>{quote.status}</TableCell>
                <TableCell>{format(new Date(quote.created_at), "PPP")}</TableCell>
                <TableCell>{format(new Date(quote.updated_at), "PPP p")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
