"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { QuoteRequest } from "@/lib/supabase"
import { Calendar, DollarSign, FileText, Phone, Mail, User } from "lucide-react"
import { createSupabaseClient } from "@/lib/supabase"

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    async function loadQuotes() {
      try {
        const supabase = createSupabaseClient()
        const { data, error } = await supabase
          .from('quote_requests')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching quote requests:', error)
          console.error('Error details:', error.message, error.code, error.details)
        } else {
          console.log('Successfully loaded quotes:', data?.length || 0, 'quotes')
        }

        setQuotes(data || [])
      } catch (error) {
        console.error("Error loading quotes:", error)
      } finally {
        setLoading(false)
      }
    }

    loadQuotes()
  }, [])

  const filteredQuotes = quotes.filter(quote => 
    filter === "all" || quote.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "quoted": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "accepted": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "completed": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading quotes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Quote Requests</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Manage custom quote requests from clients
        </p>
      </div>

      <div className="mb-6">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {filteredQuotes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No Quote Requests</h3>
              <p className="text-muted-foreground">
                {filter === "all" 
                  ? "No quote requests have been submitted yet."
                  : `No ${filter} quote requests found.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredQuotes.map((quote) => (
            <Card key={quote.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Quote #{quote.id}
                      {quote.voice_actor_id && (
                        <span className="text-sm font-normal text-muted-foreground">
                          for Actor {quote.voice_actor_id}
                        </span>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(quote.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {quote.word_count} words
                      </span>
                      {quote.estimated_price && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${quote.estimated_price}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(quote.status)}>
                    {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Client Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{quote.client_name || "Anonymous"}</span>
                  </div>
                  {quote.client_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${quote.client_email}`} className="text-blue-600 hover:underline">
                        {quote.client_email}
                      </a>
                    </div>
                  )}
                  {quote.client_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${quote.client_phone}`} className="text-blue-600 hover:underline">
                        {quote.client_phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Script Text */}
                <div>
                  <h4 className="font-medium mb-2">Script</h4>
                  <div className="p-3 bg-muted/50 rounded border-l-4 border-orange-500">
                    <p className="whitespace-pre-wrap text-sm">{quote.script_text}</p>
                  </div>
                </div>

                {/* Requirements */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{quote.revisions_requested} revisions</Badge>
                  {quote.express_delivery && <Badge variant="outline">Express Delivery</Badge>}
                  {quote.background_music && <Badge variant="outline">Background Music</Badge>}
                  {quote.sound_effects && <Badge variant="outline">Sound Effects</Badge>}
                </div>

                {/* Special Requirements */}
                {quote.special_requirements && (
                  <div>
                    <h4 className="font-medium mb-2">Special Requirements</h4>
                    <p className="text-sm text-muted-foreground">{quote.special_requirements}</p>
                  </div>
                )}

                {/* Admin Notes */}
                {quote.admin_notes && (
                  <div>
                    <h4 className="font-medium mb-2">Admin Notes</h4>
                    <p className="text-sm text-muted-foreground">{quote.admin_notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    Send Quote
                  </Button>
                  <Button variant="outline" size="sm">
                    Mark as Quoted
                  </Button>
                  <Button variant="outline" size="sm">
                    Add Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
