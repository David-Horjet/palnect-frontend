"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/shared/form-field"
import Link from "next/link"
import Logo from "@/components/shared/logo"
import { forgotPassword, resetPassword } from "@/store/slices/authSlice"
import { AppDispatch } from "@/store/store"
import { useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"

export default function ForgotPasswordPage() {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()
  const resetToken = searchParams.get("token")

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const validateEmail = () => {
    setError("")
    if (!email) {
      setError("Email is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email address")
      return false
    }
    return true
  }

  const validatePasswords = () => {
    setError("")
    if (!newPassword) {
      setError("Password is required")
      return false
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return false
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail()) return

    setIsLoading(true)
    const result = await dispatch(forgotPassword(email))
    setIsLoading(false)

    if (result.type === forgotPassword.fulfilled.type) {
      setIsSubmitted(true)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePasswords()) return

    setIsLoading(true)
    const result = await dispatch(
      resetPassword({
        token: resetToken!,
        newPassword,
      }),
    )
    setIsLoading(false)

    if (result.type === resetPassword.fulfilled.type) {
      setIsSubmitted(true)
    }


    // Reset password form (if token is provided)
    if (resetToken) {
      return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <div className="h-10 w-10 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="font-bold text-xl text-foreground">Palnect</span>
              </Link>
              <h1 className="text-3xl font-bold text-foreground mb-2">Set New Password</h1>
              <p className="text-muted-foreground">Enter your new password below</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            {isSubmitted ? (
              <div className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <span className="text-3xl">✓</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Password Reset</h1>
                <p className="text-muted-foreground mb-8">Your password has been reset successfully</p>
                <Button variant="primary" size="lg" className="w-full">
                  <Link href="/signin">Back to Sign In</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <FormField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <FormField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )
    }

    // Forgot password request form}

    if (isSubmitted) {
      return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            {/* Success Icon */}
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <span className="text-3xl">✓</span>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-6">
              We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Click the link in your email to reset your password. If you don't see it, check your spam folder.
            </p>

            <Button variant="primary" size="lg" className="w-full mb-3">
              <Link href="/auth/signin">Back to Sign In</Link>
            </Button>
            <Button variant="ghost" size="lg" className="w-full" onClick={() => setIsSubmitted(false)}>
              Try Different Email
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5"><Logo /></div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-muted-foreground">Enter your email address to receive a password reset link</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          {/* Back to Sign In */}
          <div className="text-center mt-6">
            <Link href="/auth/signin" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
