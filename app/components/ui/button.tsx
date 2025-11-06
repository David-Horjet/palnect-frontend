import type React from "react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  children: ReactNode
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "bg-primary text-primary-foreground hover:shadow-lg hover:scale-105 active:scale-95",
    secondary: "bg-secondary text-secondary-foreground hover:shadow-md hover:scale-105 active:scale-95",
    accent: "bg-accent text-accent-foreground hover:shadow-md hover:scale-105 active:scale-95",
    ghost: "bg-transparent text-foreground hover:bg-muted border border-border hover:border-primary",
    destructive: "bg-destructive text-destructive-foreground hover:shadow-md active:scale-95",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="animate-spin mr-2">●</span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
