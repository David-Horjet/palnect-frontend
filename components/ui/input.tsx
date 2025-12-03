"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  ref?: React.Ref<HTMLInputElement>
}

export function Input({ ref, className, error, label, type = "text", ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const isPasswordInput = type === "password"
  const displayType = isPasswordInput && showPassword ? "text" : type

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-foreground mb-2">{label}</label>}
      <div className="relative">
        <input
          type={displayType}
          ref={ref}
          className={cn(
            "w-full text-sm md:text-base px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-destructive focus:ring-destructive",
            isPasswordInput && "pr-10",
            className,
          )}
          {...props}
        />
        {isPasswordInput && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  )
}
