"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

interface CustomQuote {
  id: string
  details: string
  status: "new" | "reviewed" | "quoted" | "accepted" | "rejected"
  created_at: string
  updated_at: string
  profiles: {
    first_name: string | null
    last_name: string | null
    email: string | null
  } | null
}

interface CustomQuotesTableProps {
  customQuotes: CustomQuote[]
}

export function CustomQuotesTable({ customQuotes }: CustomQuotesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Quote Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested On</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customQuotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>{quote.id.substring(0, 8)}...</TableCell>
                <TableCell>
                  {quote.profiles?.first_name} {quote.profiles?.last_name}
                </TableCell>
                <TableCell>{quote.profiles?.email}</TableCell>
                <TableCell className="max-w-xs truncate">{quote.details}</TableCell>
                <TableCell>{quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}</TableCell>
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
