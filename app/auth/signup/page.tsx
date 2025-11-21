"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/shared/form-field"
import Link from "next/link"
import Logo from "@/components/shared/logo"
import { signup } from "@/store/slices/authSlice"
import { AppDispatch, RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName) newErrors.firstName = "First name is required"
    if (!formData.lastName) newErrors.lastName = "Last name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the Terms of Service and Privacy Policy"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const result = await dispatch(
        signup({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      )

      if (result.type === signup.fulfilled.type) {
        router.push("/dashboard")
      }
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5"><Logo /></div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join our community and start learning</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}
        {/* Form */}
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="First Name"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
            />
            <FormField
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
            />
          </div>

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
          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-input cursor-pointer"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-muted-foreground cursor-pointer">
              I agree to the{" "}
              <Link href="/legal/terms-of-service" target="_blank" className="text-primary hover:underline font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy-policy" target="_blank" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && <p className="text-destructive text-sm">{errors.agreeToTerms}</p>}

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
          </div>
        </div>

        {/* Link to Sign In */}
        <Button variant="outline" size="lg" className="w-full">
          <Link href="/auth/signin">Sign In Instead</Link>
        </Button>
      </div>
    </div>
  )
}
