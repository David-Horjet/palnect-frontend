"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, Users, Settings, LogOut, Menu, X, Zap, User } from "lucide-react"
import { useState } from "react"
import Logo from "@/components/shared/logo"

interface DashboardSidebarProps {
  activeTab?: string
}

export function DashboardSidebar({ activeTab = "home" }: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { id: "home", label: "Dashboard", icon: Home, href: "/dashboard" },
    { id: "resources", label: "Resources", icon: BookOpen, href: "/dashboard/resources" },
    { id: "mentors", label: "Find Mentors", icon: Users, href: "/dashboard/mentors" },
    { id: "points", label: "Points", icon: Zap, href: "/dashboard/points" },
    { id: "profile", label: "Profile", icon: User, href: "/dashboard/profile" },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-40 p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 border-r border-border bg-background transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:relative md:translate-x-0 z-30`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex justify-center"><Logo /></div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex text-sm md:text-base items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-2">
            <Link
              href="/dashboard/settings"
              className="flex text-sm md:text-base  items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm md:text-base justify-start gap-3 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
