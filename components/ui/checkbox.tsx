"use client"

import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            ref={ref}
            id={id}
            className={cn(
              "w-4 h-4 rounded border-2 border-input bg-background text-primary cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed accent-primary",
              error && "border-destructive focus:ring-destructive",
              className,
            )}
            {...props}
          />
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer select-none">
              {label}
            </label>
          )}
        </div>
        {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      </div>
    )
  },
)

Checkbox.displayName = "Checkbox"
