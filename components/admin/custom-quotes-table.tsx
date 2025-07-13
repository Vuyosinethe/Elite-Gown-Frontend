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
  user_id: string
  quote_number: string
  description: string
  status: "pending" | "reviewed" | "quoted" | "accepted" | "rejected" | "completed"
  quoted_price: number | null
  created_at: string
  updated_at: string
}

export function CustomQuotesTable() {
  const [quotes, setQuotes] = useState<CustomQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPrice, setEditingPrice] = useState<string | null>(null) // quoteId being edited
  const [newPrice, setNewPrice] = useState<string>("")

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
      console.error("Error fetching custom quotes:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  const handleStatusChange = async (quoteId: string, newStatus: CustomQuote["status"]) => {
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

      // Update the local state with the new status
      setQuotes((prevQuotes) =>
        prevQuotes.map((quote) => (quote.id === quoteId ? { ...quote, status: newStatus } : quote)),
      )
    } catch (err: any) {
      alert(`Failed to update quote status: ${err.message}`)
      console.error("Error updating quote status:", err)
    }
  }

  const handlePriceUpdate = async (quoteId: string) => {
    const priceValue = Number.parseFloat(newPrice)
    if (isNaN(priceValue) || priceValue < 0) {
      alert("Please enter a valid positive number for the price.")
      return
    }

    try {
      const response = await fetch(`/api/admin/custom-quotes/${quoteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quoted_price: priceValue }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update quote price")
      }

      // Update the local state with the new price
      setQuotes((prevQuotes) =>
        prevQuotes.map((quote) => (quote.id === quoteId ? { ...quote, quoted_price: priceValue } : quote)),
      )
      setEditingPrice(null)
      setNewPrice("")
    } catch (err: any) {
      alert(`Failed to update quote price: ${err.message}`)
      console.error("Error updating quote price:", err)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 text-center">Loading custom quotes...</CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-red-500">Error: {error}</CardContent>
      </Card>
    )
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
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quoted Price</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>{quote.quote_number}</TableCell>
                <TableCell>{quote.user_id}</TableCell>
                <TableCell className="max-w-[200px] truncate">{quote.description}</TableCell>
                <TableCell>
                  <Select
                    value={quote.status}
                    onValueChange={(value: CustomQuote["status"]) => handleStatusChange(quote.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {editingPrice === quote.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="Enter price"
                        className="w-28"
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
                          setNewPrice(quote.quoted_price?.toString() || "")
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </TableCell>
                <TableCell>{format(new Date(quote.created_at), "PPP")}</TableCell>
                <TableCell>{/* Add any other actions here if needed */}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
