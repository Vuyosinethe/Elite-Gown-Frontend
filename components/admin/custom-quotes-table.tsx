"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CustomQuote {
  id: string
  user_id: string | null
  guest_id: string | null
  name: string
  email: string
  phone: string | null
  description: string
  status: string
  created_at: string
  updated_at: string
}

export function CustomQuotesTable() {
  const [quotes, setQuotes] = useState<CustomQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuotes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/custom-quotes")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch custom quotes")
      }
      const data: CustomQuote[] = await response.json()
      setQuotes(data)
    } catch (err) {
      console.error("Error fetching custom quotes:", err)
      setError((err as Error).message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleStatusChange = useCallback(async (quoteId: string, newStatus: string) => {
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
    } catch (err) {
      console.error("Error updating quote status:", err)
      alert(`Failed to update quote status: ${(err as Error).message}`)
    }
  }, [])

  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Quotes</CardTitle>
          <CardDescription>Manage custom design requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Loading custom quotes...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Quotes</CardTitle>
          <CardDescription>Manage custom design requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Quotes</CardTitle>
        <CardDescription>Manage custom design requests.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">{quote.name}</TableCell>
                <TableCell>{quote.email}</TableCell>
                <TableCell>{quote.phone || "N/A"}</TableCell>
                <TableCell>
                  <Select value={quote.status} onValueChange={(value) => handleStatusChange(quote.id, value)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{format(new Date(quote.created_at), "PPP")}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Quote Details from {quote.name}</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="grid gap-4 py-4 text-sm">
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">Quote ID:</span>
                            <span>{quote.id}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">User ID:</span>
                            <span>{quote.user_id || quote.guest_id || "N/A"}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">Name:</span>
                            <span>{quote.name}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">Email:</span>
                            <span>{quote.email}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">Phone:</span>
                            <span>{quote.phone || "N/A"}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">Status:</span>
                            <span>{quote.status}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">Created At:</span>
                            <span>{format(new Date(quote.created_at), "PPP p")}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">Last Updated:</span>
                            <span>{format(new Date(quote.updated_at), "PPP p")}</span>
                          </div>
                          <div className="col-span-2">
                            <h4 className="font-semibold mt-4">Description:</h4>
                            <p className="whitespace-pre-wrap">{quote.description}</p>
                          </div>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
