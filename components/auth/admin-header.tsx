"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { LogOut, User } from "lucide-react"

export function AdminHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">VoiceMarket ადმინისტრაცია</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {user?.email}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            გასვლა
          </Button>
        </div>
      </div>
    </header>
  )
}
