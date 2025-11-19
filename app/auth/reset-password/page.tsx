"use client"

import type React from "react"
import { Suspense, useState } from "react"
import { useDispatch } from "react-redux"
import { resetPassword } from "@/store/slices/authSlice"
import type { AppDispatch } from "@/store/store"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/shared/form-field"
import Link from "next/link"
import { useSearchParams, useRouter } from 'next/navigation'
import Logo from "@/components/shared/logo"

const ResetPasswordContent = () => {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    if (!token) {
        return (
            <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <span className="text-3xl">✕</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Invalid Reset Link</h1>
                    <p className="text-muted-foreground mb-8">This password reset link is invalid or has expired.</p>
                    <Button variant="primary" size="lg" className="w-full">
                        <Link href="/forgot-password">Request New Link</Link>
                    </Button>
                </div>
            </div>
        )
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
        if (!validatePasswords()) return

        setIsLoading(true)
        const result = await dispatch(
            resetPassword({
                token,
                newPassword,
            }),
        )
        setIsLoading(false)

        if (result.type === resetPassword.fulfilled.type) {
            setIsSubmitted(true)
            setTimeout(() => {
                router.push("/auth/signin")
            }, 2000)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                        <span className="text-3xl">✓</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Password Reset Successfully</h1>
                    <p className="text-muted-foreground mb-8">Your password has been reset. Redirecting to sign in...</p>
                    <Button variant="primary" size="lg" className="w-full">
                        <Link href="/auth/signin">Go to Sign In</Link>
                    </Button> 
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-5"><Logo /></div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Set New Password</h1>
                    <p className="text-muted-foreground">Create a strong password for your account</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField
                        label="New Password"
                        name="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e: { target: { value: React.SetStateAction<string> } }) => setNewPassword(e.target.value)}
                        required
                    />
                    <FormField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e: { target: { value: React.SetStateAction<string> } }) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>

                <div className="text-center mt-6">
                    <Link href="/auth/signin" className="text-sm text-primary hover:text-primary/80 transition-colors">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}

const ResetPasswordPage = () => {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen overflow-hidden">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-pulse">Loading...</div>
                    </div>
                </div>
            }
        >
            <ResetPasswordContent />
        </Suspense>)
}

export default ResetPasswordPage
