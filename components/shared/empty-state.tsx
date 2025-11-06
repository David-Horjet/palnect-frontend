"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  ctaText?: string
  ctaHref?: string
  onCTA?: () => void
}

export function EmptyState({ icon, title, description, ctaText, ctaHref, onCTA }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-4xl text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      {ctaText && (
        <Button variant="primary" onClick={onCTA} asChild={!!ctaHref}>
          {ctaHref ? <a href={ctaHref}>{ctaText}</a> : ctaText}
        </Button>
      )}
    </div>
  )
}
