"use client"

import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface BadgeGroupProps {
  items: string[]
  onRemove?: (item: string) => void
  variant?: "default" | "secondary" | "outline"
  className?: string
}

export function BadgeGroup({ items, onRemove, variant = "secondary", className = "" }: BadgeGroupProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item, i) => (
        <Badge key={i} variant={variant} className="flex items-center gap-1">
          {item}
          {onRemove && (
            <button
              onClick={() => onRemove(item)}
              className="ml-1 hover:opacity-70 transition-opacity"
              aria-label={`Remove ${item}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  )
}
