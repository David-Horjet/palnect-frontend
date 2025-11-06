"use client"

import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>

          {/* Search and Notifications */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-2">
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">Search</span>
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
