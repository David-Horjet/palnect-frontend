"use client"

import type React from "react"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/store/store"

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user?.is_admin)) {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, user?.is_admin, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user?.is_admin) {
    return null
  }

  return <>{children}</>
}
