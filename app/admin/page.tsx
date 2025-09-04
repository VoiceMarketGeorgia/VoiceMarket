"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Users, TrendingUp } from "lucide-react"
import { createSupabaseClient } from "@/lib/supabase"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalQuotes: 0,
    pendingQuotes: 0,
    totalContacts: 0,
    newContacts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const supabase = createSupabaseClient()
        
        const [quotesResult, contactsResult] = await Promise.all([
          supabase.from('quote_requests').select('*'),
          supabase.from('contact_submissions').select('*')
        ])

        const quotes = quotesResult.data || []
        const contacts = contactsResult.data || []

        setStats({
          totalQuotes: quotes.length,
          pendingQuotes: quotes.filter(q => q.status === 'pending').length,
          totalContacts: contacts.length,
          newContacts: contacts.filter(c => c.status === 'new').length,
        })
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">ადმინისტრაციის პანელი</h1>
        <div className="text-center py-8">
          <p className="text-muted-foreground">იტვირთება...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ადმინისტრაციის პანელი</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">სულ ფასის მოთხოვნები</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuotes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">მოლოდინში მყოფი</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingQuotes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">სულ შეტყობინებები</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ახალი შეტყობინებები</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.newContacts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>სწრაფი მოქმედებები</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">ფასის მოთხოვნების მართვა</h3>
              <p className="text-sm text-muted-foreground">
                მომხმარებლების ფასის მოთხოვნების განხილვა და პასუხი
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">შეტყობინებების მართვა</h3>
              <p className="text-sm text-muted-foreground">
                მომხმარებლების შეკითხვების და მხარდაჭერის მოთხოვნების მართვა
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">ხმოვანი მსახიობების მართვა</h3>
              <p className="text-sm text-muted-foreground">
                მსახიობების პროფილების, ფასების და ხელმისაწვდომობის განახლება
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ბოლო აქტივობა</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">{stats.pendingQuotes} ფასის მოთხოვნა მოლოდინშია</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">{stats.newContacts} ახალი შეტყობინება</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">47 ხმოვანი მსახიობი აქტიურია</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
