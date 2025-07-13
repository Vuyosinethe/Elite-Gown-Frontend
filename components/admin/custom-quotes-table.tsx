"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface CustomQuote {
  id: string
  quote_number: string
  user_id: string | null
  guest_id: string | null
  customer_name: string
  customer_email: string
  phone_number: string | null
  description: string
  status: string
  quoted_price: number | null
  quoted_at: string | null
  created_at: string
}

const QUOTE_STATUSES = ["pending", "reviewed", "quoted", "accepted", "rejected"]

export function CustomQuotesTable() {
  const [quotes, setQuotes] = useState<CustomQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [currentPrice, setCurrentPrice] = useState<string>("")

  useEffect(() => {
    async function fetchQuotes() {
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
        prevQuotes.map((quote) => (quote.id === quoteId ? { ...quote, status: newStatus } : quote)),
      )
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handlePriceUpdate = async (quoteId: string) => {
    try {
      const price = Number.parseFloat(currentPrice)
      if (isNaN(price)) {
        setError("Invalid price entered.")
        return
      }

      const response = await fetch(`/api/admin/custom-quotes/${quoteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quoted_price: price, status: "quoted" }), // Automatically set status to 'quoted'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update quote price")
      }

      setQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote.id === quoteId
            ? { ...quote, quoted_price: price, status: "quoted", quoted_at: new Date().toISOString() }
            : quote,
        ),
      )
      setEditingPrice(null)
      setCurrentPrice("")
    } catch (err: any) {
      setError(err.message)
    }
  }

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
              <TableHead>Quote #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quoted Price</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>{quote.quote_number}</TableCell>
                <TableCell>{quote.customer_name}</TableCell>
                <TableCell>{quote.customer_email}</TableCell>
                <TableCell>{quote.phone_number || "N/A"}</TableCell>
                <TableCell className="max-w-[200px] truncate">{quote.description}</TableCell>
                <TableCell>
                  <Select value={quote.status} onValueChange={(value) => handleStatusChange(quote.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
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
                <TableCell>
                  {editingPrice === quote.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={currentPrice}
                        onChange={(e) => setCurrentPrice(e.target.value)}
                        placeholder="Price"
                        className="w-24"
                      />
                      <Button size="sm" onClick={() => handlePriceUpdate(quote.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingPrice(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{quote.quoted_price ? `$${quote.quoted_price.toFixed(2)}` : "N/A"}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingPrice(quote.id)
                          setCurrentPrice(quote.quoted_price?.toString() || "")
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </TableCell>
                <TableCell>{format(new Date(quote.created_at), "PPP")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
