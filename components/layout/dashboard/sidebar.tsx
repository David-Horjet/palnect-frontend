"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, Users, Settings, LogOut, Menu, X, Zap, User, UserPlus2, MessageCircle, MessageSquareReply } from "lucide-react"
import { GraduationCap } from "lucide-react"
import { useState } from "react"
import Logo from "@/components/shared/logo"
import { logout } from "@/store/slices/authSlice"
import { AppDispatch } from "@/store/store"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"

interface DashboardSidebarProps {
  activeTab?: string
}

export function DashboardSidebar({ activeTab = "home" }: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const navItems = [
    { id: "home", label: "Dashboard", icon: Home, href: "/dashboard" },
    { id: "resources", label: "Library", icon: BookOpen, href: "/dashboard/resources" }, 
      { id: "tools", label: "Tools", icon: GraduationCap, href: "/dashboard/tools" },
    { id: "mentors", label: "Find Mentors", icon: Users, href: "/dashboard/mentors" },
    { id: "lexi", label: "Chat Lexi", icon: MessageCircle, href: "/dashboard/lexi" },
    { id: "messages", label: "Messages", icon: MessageSquareReply, href: "/dashboard/messages" },
    { id: "subscriptions", label: "Subscriptions", icon: UserPlus2, href: "/dashboard/subscriptions" },
    { id: "points", label: "Credits", icon: Zap, href: "/dashboard/credits" },
    { id: "profile", label: "Profile", icon: User, href: "/dashboard/profile" },
  ]

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      router.push("/auth/signin")
    })
  }

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
        className={`fixed left-0 top-0 h-screen w-64 border-r border-border bg-background transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
                  className={`flex text-sm md:text-base items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-2">
            <Link
              href="/dashboard/settings"
              className="flex text-sm md:text-base  items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm md:text-base justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
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
