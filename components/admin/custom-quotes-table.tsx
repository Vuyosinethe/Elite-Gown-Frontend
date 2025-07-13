"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface CustomQuote {
  id: string
  quote_number: string
  user_id: string | null
  guest_id: string | null
  contact_email: string
  contact_phone: string | null
  description: string
  status: string
  quoted_price: number | null
  quoted_currency: string | null
  created_at: string
  updated_at: string
}

const QUOTE_STATUSES = ["pending", "reviewed", "quoted", "accepted", "rejected", "completed"]

export function CustomQuotesTable() {
  const [quotes, setQuotes] = useState<CustomQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null)
  const [currentPrice, setCurrentPrice] = useState<string>("")

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
      console.error("Error updating status:", err)
      alert(`Failed to update status: ${err.message}`)
    }
  }

  const handlePriceUpdate = async (quoteId: string) => {
    if (!currentPrice || isNaN(Number.parseFloat(currentPrice))) {
      alert("Please enter a valid number for the price.")
      return
    }

    try {
      const response = await fetch(`/api/admin/custom-quotes/${quoteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "quoted", quoted_price: Number.parseFloat(currentPrice) }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update quote price")
      }

      setQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote.id === quoteId
            ? {
                ...quote,
                status: "quoted",
                quoted_price: Number.parseFloat(currentPrice),
                quoted_currency: "USD", // Assuming USD for now
                updated_at: new Date().toISOString(),
              }
            : quote,
        ),
      )
      setEditingQuoteId(null)
      setCurrentPrice("")
    } catch (err: any) {
      console.error("Error updating price:", err)
      alert(`Failed to update price: ${err.message}`)
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
              <TableHead>Customer Email</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quoted Price</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>{quote.quote_number}</TableCell>
                <TableCell>{quote.contact_email}</TableCell>
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
                  {editingQuoteId === quote.id ? (
                    <Input
                      type="number"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(e.target.value)}
                      placeholder="Enter price"
                      className="w-[100px]"
                    />
                  ) : quote.quoted_price ? (
                    `${quote.quoted_price} ${quote.quoted_currency}`
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>{format(new Date(quote.created_at), "PPP")}</TableCell>
                <TableCell>
                  {editingQuoteId === quote.id ? (
                    <Button size="sm" onClick={() => handlePriceUpdate(quote.id)}>
                      Save
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingQuoteId(quote.id)
                        setCurrentPrice(quote.quoted_price?.toString() || "")
                      }}
                    >
                      Set Price
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
