"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin } from "lucide-react"

interface MentorCardProps {
  name: string
  title: string
  bio: string
  image?: string
  expertise: string[]
  rating?: number
  students?: number
  location?: string
}

export function MentorCard({
  name,
  title,
  bio,
  image,
  expertise,
  rating = 4.8,
  students = 0,
  location,
}: MentorCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="flex flex-col gap-4 h-full">
        {/* Header with Avatar */}
        <div className="flex gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            <p className="text-sm text-muted-foreground truncate">{title}</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground line-clamp-2">{bio}</p>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-2">
          {expertise.slice(0, 3).map((skill, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {expertise.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{expertise.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span>{rating}</span>
            </div>
          )}
          {students > 0 && <span>{students} students</span>}
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button variant="primary" size="sm" className="w-full">
          Connect
        </Button>
      </div>
    </Card>
  )
}
