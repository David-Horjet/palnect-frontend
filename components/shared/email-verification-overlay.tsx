"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { authService } from "@/services/api/auth"
import { toast } from "@/lib/toast"
import { Button } from "@/components/ui/button"

export function EmailVerificationOverlay() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [isResending, setIsResending] = useState(false)

  const handleResendVerification = async () => {
    if (!user?.email) return

    setIsResending(true)
    try {
      const response = await authService.resendVerification(user.email)
      toast.success(response.message || "Verification email sent successfully")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to resend verification email"
      toast.error(message)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />

      {/* Overlay */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="text-card-foreground rounded-xl border border-border/30 shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Verify Your Email</h2>
              <p className="text-muted-foreground text-sm md:text-base mb-4">
                We've sent a verification link to <strong>{user?.email}</strong>. Please check your inbox and click the link to verify your account.
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mb-6">
                Didn't receive the email? Check your spam folder or resend the verification link.
              </p>
            </div>
            <Button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? "Sending..." : "Resend Verification Email"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}