"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/shared/form-field"
import Link from "next/link"
import Logo from "@/components/shared/logo"
import { login } from "@/store/slices/authSlice"
import { AppDispatch, RootState } from "@/store/store"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"

export default function SignInPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { loading, error } = useSelector((state: RootState) => state.auth)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.password) newErrors.password = "Password is required"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const result: any = await dispatch(
        login({
          email: formData.email,
          password: formData.password,
        }),
      )

      if (result.type === login.fulfilled.type) {
        if (result?.payload.user.is_admin) {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5"><Logo /></div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Error Alert */}
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
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">New to Palnect?</span>
          </div>
        </div>

        {/* Link to Sign Up */}
        <Button variant="outline" size="lg" className="w-full">
          <Link href="/auth/signup">Create Account</Link>
        </Button>
      </div>
    </div>
  )
}
