"use client"

import type React from "react"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
}

export function Card({
  children,
  className,
  hover = false,
  onClick,
  draggable = false,
  onDragStart,
  onDragEnd,
  onDrop,
  onDragOver,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card text-card-foreground border border-border p-4 md:p-6 shadow-sm transition-all duration-300",
        hover && "hover:shadow-lg hover:border-primary hover:scale-105",
        (onClick || draggable) && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      onDragOver={onDragOver}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mb-4", className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("text-xl font-bold text-foreground", className)}>{children}</h2>
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("", className)}>{children}</div>
}
