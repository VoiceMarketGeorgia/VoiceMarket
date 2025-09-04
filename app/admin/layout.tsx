"use client"

import { AuthProvider } from "@/components/auth/auth-provider"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminHeader } from "@/components/auth/admin-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, Users, BarChart3 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <AdminHeader />
          
          <div className="container mx-auto px-4 py-4 md:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-4 lg:gap-8">
              {/* Sidebar */}
              <aside className="space-y-4">
                <nav className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  <Link href="/admin">
                    <Button variant="ghost" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      მთავარი გვერდი
                    </Button>
                  </Link>
                  <Link href="/admin/quotes">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      ფასის მოთხოვნები
                    </Button>
                  </Link>
                  <Link href="/admin/contacts">
                    <Button variant="ghost" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      შეტყობინებები
                    </Button>
                  </Link>
                  <Link href="/admin/actors">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      ხმოვანი მსახიობები
                    </Button>
                  </Link>
                </nav>
              </aside>

              {/* Main Content */}
              <main className="flex-1">
                {children}
              </main>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  )
}
