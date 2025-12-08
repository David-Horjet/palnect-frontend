"use client"

import type React from "react"

import { AdminProtectedRoute } from "@/middleware/admin-protected-route"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/store/slices/authSlice"
import type { AppDispatch, RootState } from "@/store/store"
import { Button } from "@/components/ui/button"
import Logo from "@/components/shared/logo"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      router.push("/auth/signin")
    })
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Logo />
              <nav className="flex items-center gap-6">
                <Link
                  href="/admin"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/mentors"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Mentors
                </Link>
                <Link
                  href="/admin/points"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Points
                </Link>
                <Link
                  href="/admin/payout"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Payouts
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.first_name} {user?.last_name}
              </span>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      </div>
    </AdminProtectedRoute>
  )
}
