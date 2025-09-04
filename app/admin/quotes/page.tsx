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
      case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "მოლოდინში"
      case "in_progress": return "მუშავდება"
      case "completed": return "დასრულებული"
      case "cancelled": return "გაუქმებული"
      default: return status
    }
  }

  const updateQuoteStatus = async (quoteId: number, newStatus: string) => {
    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase
        .from('quote_requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', quoteId)

      if (error) {
        console.error('Error updating status:', error)
        return
      }

      // Update local state
      setQuotes(quotes.map(quote => 
        quote.id === quoteId ? { ...quote, status: newStatus } : quote
      ))
    } catch (error) {
      console.error('Error updating quote status:', error)
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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">ფასის მოთხოვნები</h1>
        <p className="text-sm md:text-xl text-muted-foreground mt-2">
          მომხმარებლების ფასის მოთხოვნების მართვა
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="სტატუსით ფილტრაცია" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ყველა მოთხოვნა ({quotes.length})</SelectItem>
            <SelectItem value="pending">მოლოდინში ({quotes.filter(q => q.status === 'pending').length})</SelectItem>
            <SelectItem value="in_progress">მუშავდება ({quotes.filter(q => q.status === 'in_progress').length})</SelectItem>
            <SelectItem value="completed">დასრულებული ({quotes.filter(q => q.status === 'completed').length})</SelectItem>
            <SelectItem value="cancelled">გაუქმებული ({quotes.filter(q => q.status === 'cancelled').length})</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="text-sm text-muted-foreground">
          სულ: {filteredQuotes.length} მოთხოვნა
        </div>
      </div>

      <div className="space-y-6">
        {filteredQuotes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">ფასის მოთხოვნები არ არის</h3>
              <p className="text-muted-foreground">
                {filter === "all" 
                  ? "ჯერ არ შემოსულა ფასის მოთხოვნები."
                  : `${filter === "pending" ? "მოლოდინში" : 
                      filter === "in_progress" ? "მუშავდება" : 
                      filter === "completed" ? "დასრულებული" : 
                      "გაუქმებული"} სტატუსით მოთხოვნები არ მოიძებნა.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredQuotes.map((quote) => (
            <Card key={quote.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">მოთხოვნა #{quote.id}</span>
                      {quote.voice_actor_id && (
                        <span className="text-sm font-normal text-muted-foreground whitespace-nowrap">
                          მსახიობი {quote.voice_actor_id}
                        </span>
                      )}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Calendar className="h-4 w-4" />
                        {new Date(quote.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <FileText className="h-4 w-4" />
                        {quote.word_count} სიტყვა
                      </span>
                      {quote.estimated_price && (
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <DollarSign className="h-4 w-4" />
                          ${quote.estimated_price}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Badge className={getStatusColor(quote.status)}>
                      {getStatusLabel(quote.status)}
                    </Badge>
                    <Select 
                      value={quote.status} 
                      onValueChange={(newStatus) => updateQuoteStatus(quote.id, newStatus)}
                    >
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">მოლოდინში</SelectItem>
                        <SelectItem value="in_progress">მუშავდება</SelectItem>
                        <SelectItem value="completed">დასრულებული</SelectItem>
                        <SelectItem value="cancelled">გაუქმებული</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Client Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium truncate">{quote.client_name || "ანონიმური"}</span>
                  </div>
                  {quote.client_email && (
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a 
                        href={`mailto:${quote.client_email}`} 
                        className="text-blue-600 hover:underline truncate"
                        title={quote.client_email}
                      >
                        {quote.client_email}
                      </a>
                    </div>
                  )}
                  {quote.client_phone && (
                    <div className="flex items-center gap-2 min-w-0">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a 
                        href={`tel:${quote.client_phone}`} 
                        className="text-blue-600 hover:underline"
                      >
                        {quote.client_phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Script Text */}
                <div>
                  <h4 className="font-medium mb-2">სკრიპტი</h4>
                  <div className="p-3 bg-muted/50 rounded border-l-4 border-orange-500">
                    <p className="whitespace-pre-wrap text-sm">{quote.script_text}</p>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="font-medium mb-2">პროექტის მოთხოვნები</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{quote.revisions_requested} შესწორება</Badge>
                    {quote.express_delivery && <Badge variant="outline">სწრაფი მიწოდება</Badge>}
                    {quote.background_music && <Badge variant="outline">ფონური მუსიკა</Badge>}
                    {quote.sound_effects && <Badge variant="outline">ხმოვანი ეფექტები</Badge>}
                  </div>
                </div>

                {/* Special Requirements */}
                {quote.special_requirements && (
                  <div>
                    <h4 className="font-medium mb-2">დამატებითი მოთხოვნები</h4>
                    <div className="p-3 bg-muted/30 rounded text-sm">
                      {quote.special_requirements}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {quote.admin_notes && (
                  <div>
                    <h4 className="font-medium mb-2">ადმინისტრაციის შენიშვნები</h4>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded text-sm">
                      {quote.admin_notes}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`mailto:${quote.client_email}`, '_blank')}
                    disabled={!quote.client_email}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    ელ-ფოსტა
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`tel:${quote.client_phone}`, '_blank')}
                    disabled={!quote.client_phone}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    ზარი
                  </Button>
                  {quote.voice_actor_id && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`/talents/${quote.voice_actor_id}`, '_blank')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      მსახიობი
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
