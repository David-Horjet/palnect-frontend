"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Star } from "lucide-react"

interface ResourceCardProps {
  title: string
  description: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  rating?: number
  tags?: string[]
  icon?: React.ReactNode
}

export function ResourceCard({
  title,
  description,
  category,
  level,
  rating = 0,
  tags = [],
  icon = <BookOpen className="h-8 w-8" />,
}: ResourceCardProps) {
  const levelColors = {
    beginner: "bg-success/10 text-success",
    intermediate: "bg-warning/10 text-warning",
    advanced: "bg-destructive/10 text-destructive",
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="flex flex-col gap-4 h-full">
        {/* Icon and Category */}
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-lg bg-primary/10">{icon}</div>
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </div>

        {/* Title and Description */}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        </div>

        {/* Level */}
        <div className="flex items-center gap-2">
          <Badge className={`text-xs ${levelColors[level]}`} variant="outline">
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Badge>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Rating and CTA */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          {rating > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span>{rating}</span>
            </div>
          )}
          <Button variant="secondary" size="sm" className="ml-auto">
            View
          </Button>
        </div>
      </div>
    </Card>
  )
}
