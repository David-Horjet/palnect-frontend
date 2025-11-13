"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { BookOpen, Users, Award } from "lucide-react"

interface FeedItem {
  id: string
  type: "resource" | "mentor" | "achievement"
  title: string
  description: string
  timestamp: string
  icon?: React.ReactNode
}

interface ActivityFeedProps {
  items?: FeedItem[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  const defaultItems: FeedItem[] = [
    {
      id: "1",
      type: "resource",
      title: "New Resource Available",
      description: "React Advanced Patterns course is now available",
      timestamp: "2 hours ago",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: "2",
      type: "mentor",
      title: "Mentor Available",
      description: "Sarah Chen is now accepting new mentees",
      timestamp: "5 hours ago",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "3",
      type: "achievement",
      title: "Achievement Unlocked",
      description: "You completed 5 resources - Learning Streak",
      timestamp: "1 day ago",
      icon: <Award className="h-5 w-5" />,
    },
  ]

  const displayItems = items || defaultItems

  return (
    <div className="space-y-3">
      {displayItems.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
