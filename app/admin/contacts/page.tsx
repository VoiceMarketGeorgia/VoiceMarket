"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContactSubmission } from "@/lib/supabase"
import { Calendar, Mail, MessageSquare, User } from "lucide-react"
import { createSupabaseClient } from "@/lib/supabase"

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    async function loadContacts() {
      try {
        const supabase = createSupabaseClient()
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching contact submissions:', error)
          throw error
        }

        setContacts(data || [])
      } catch (error) {
        console.error("Error loading contacts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContacts()
  }, [])

  const filteredContacts = contacts.filter(contact => 
    filter === "all" || contact.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "read": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "responded": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "closed": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getSubjectLabel = (subject: string) => {
    switch (subject) {
      case "general": return "ზოგადი კითხვა"
      case "support": return "მომხმარებელთა მხარდაჭერა"
      case "billing": return "ფასდაკლების კითხვა"
      case "partnership": return "პარტნიორობის შესაძლებლობა"
      case "talent": return "ხმოვანი მსახიობის გახდომა"
      default: return subject
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading contacts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No Contact Submissions</h3>
              <p className="text-muted-foreground">
                {filter === "all" 
                  ? "No contact submissions have been received yet."
                  : `No ${filter} contact submissions found.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredContacts.map((contact) => (
            <Card key={contact.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      {getSubjectLabel(contact.subject)}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(contact.created_at).toLocaleDateString()} at{" "}
                        {new Date(contact.created_at).toLocaleTimeString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {contact.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                          {contact.email}
                        </a>
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(contact.status)}>
                    {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Message</h4>
                  <div className="p-3 bg-muted/50 rounded border-l-4 border-orange-500">
                    <p className="whitespace-pre-wrap text-sm">{contact.message}</p>
                  </div>
                </div>

                {contact.admin_notes && (
                  <div>
                    <h4 className="font-medium mb-2">Admin Notes</h4>
                    <p className="text-sm text-muted-foreground">{contact.admin_notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                  <Button variant="outline" size="sm">
                    Mark as Read
                  </Button>
                  <Button variant="outline" size="sm">
                    Add Notes
                  </Button>
                  <Button variant="outline" size="sm">
                    Close
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
