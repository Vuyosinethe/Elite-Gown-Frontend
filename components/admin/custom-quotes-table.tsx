"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface CustomQuote {
  id: string
  user_id: string
  quote_number: string
  status: string
  product_type: string
  description: string
  quantity: number
  estimated_price: number | null
  final_price: number | null
  created_at: string
  updated_at: string
}

const QUOTE_STATUSES = ["pending", "reviewing", "quoted", "approved", "in_production", "completed", "cancelled"]

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

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/custom-quotes/${quoteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update quote status")
      }

      setQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote.id === quoteId ? { ...quote, status: newStatus, updated_at: new Date().toISOString() } : quote,
        ),
      )
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading custom quotes...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Quote Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote #</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Product Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Est. Price</TableHead>
              <TableHead>Final Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>{quote.quote_number}</TableCell>
                <TableCell>{quote.user_id}</TableCell>
                <TableCell>{quote.product_type}</TableCell>
                <TableCell className="max-w-[200px] truncate">{quote.description}</TableCell>
                <TableCell>{quote.quantity}</TableCell>
                <TableCell>{quote.estimated_price ? `$${quote.estimated_price.toFixed(2)}` : "N/A"}</TableCell>
                <TableCell>{quote.final_price ? `$${quote.final_price.toFixed(2)}` : "N/A"}</TableCell>
                <TableCell>
                  <Select value={quote.status} onValueChange={(value) => handleStatusChange(quote.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUOTE_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{format(new Date(quote.created_at), "PPP")}</TableCell>
                <TableCell>{format(new Date(quote.updated_at), "PPP")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
