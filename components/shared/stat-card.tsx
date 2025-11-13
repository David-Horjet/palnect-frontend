"use client"

import type React from "react"

import { Card } from "@/components/ui/card"

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral"
}

export function StatCard({ label, value, change, icon, trend = "neutral" }: StatCardProps) {
  const trendColor = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs md:text-sm text-muted-foreground mb-2">{label}</p>
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">{value}</h3>
          {change && <p className={`text-xs mt-2 ${trendColor[trend]}`}>{change}</p>}
        </div>
        {icon && <div className="text-primary opacity-50">{icon}</div>}
      </div>
    </Card>
  )
}
