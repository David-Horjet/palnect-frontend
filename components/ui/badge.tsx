"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "outline"
  className?: string
  onClick?: () => void
  onDelete?: () => void
  deletable?: boolean
}

export function Badge({ children, variant = "default", className, onClick, onDelete, deletable = false }: BadgeProps) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-destructive/10 text-destructive",
    outline: "bg-transparent border border-border text-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs md:text-sm font-medium",
        (onClick || deletable) && "cursor-pointer hover:opacity-80 transition-opacity",
        variants[variant],
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
      {deletable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.()
          }}
          className="ml-1 hover:opacity-60"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  )
}
