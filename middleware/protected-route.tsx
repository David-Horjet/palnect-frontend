"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState, AppDispatch } from "@/store/store"
import { initializeAuth } from "@/store/slices/authSlice"
import { EmailVerificationOverlay } from "@/components/shared/email-verification-overlay"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (token && !isInitialized) {
      dispatch(initializeAuth()).then(() => {
        setIsInitialized(true)
      })
    } else if (!token) {
      setIsInitialized(true)
    }
  }, [dispatch, isInitialized])

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, isInitialized, router])

  if (!isInitialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (!user?.is_verified) {
    return <EmailVerificationOverlay />
  }

  return <>{children}</>
}