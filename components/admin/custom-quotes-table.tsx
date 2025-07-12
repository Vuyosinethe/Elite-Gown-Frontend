"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

interface CustomQuote {
  id: string
  user_id: string
  request_details: string
  status: string
  created_at: string
  updated_at: string
  quote_response: any // Adjust type as per your quote response structure
}

export function CustomQuotesTable() {
  const [customQuotes, setCustomQuotes] = useState<CustomQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomQuotes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/custom-quotes")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch custom quotes")
      }
      const data: CustomQuote[] = await response.json()
      setCustomQuotes(data)
    } catch (err: any) {
      setError(err.message)
      console.error("Failed to fetch custom quotes:", err)
      toast({
        title: "Error",
        description: `Failed to load custom quotes: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomQuotes()
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
        throw new Error(errorData.error || "Failed to update custom quote status")
      }

      // Update the quote in the local state
      setCustomQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote.id === quoteId ? { ...quote, status: newStatus, updated_at: new Date().toISOString() } : quote,
        ),
      )
      toast({
        title: "Success",
        description: `Custom quote ${quoteId} status updated to ${newStatus}.`,
        variant: "success",
      })
    } catch (err: any) {
      console.error("Failed to update custom quote status:", err)
      toast({
        title: "Error",
        description: `Failed to update custom quote status: ${err.message}`,
        variant: "destructive",
      })
    }
  }

  if (loading) return <div className="text-center py-4">Loading custom quotes...</div>
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>

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
              <TableHead>User ID</TableHead>
              <TableHead>Request Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customQuotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>{quote.id}</TableCell>
                <TableCell>{quote.user_id}</TableCell>
                <TableCell className="max-w-[200px] truncate">{quote.request_details}</TableCell>
                <TableCell>
                  <Select value={quote.status} onValueChange={(value) => handleStatusChange(quote.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Status" />
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
                <TableCell>{format(new Date(quote.created_at), "PPP p")}</TableCell>
                <TableCell>{format(new Date(quote.updated_at), "PPP p")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
