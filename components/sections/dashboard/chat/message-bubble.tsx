"use client"

import { useEffect, useState } from "react"
import { Bot, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
  createdAt: string
  isLoading?: boolean
}

export function MessageBubble({ role, content, createdAt, isLoading }: MessageBubbleProps) {
  const [displayedContent, setDisplayedContent] = useState("")
  const isUser = role === "user"

  // Typewriter effect for assistant messages
  useEffect(() => {
    if (!isUser && content && !isLoading) {
      let index = 0
      const interval = setInterval(() => {
        if (index <= content.length) {
          setDisplayedContent(content.substring(0, index))
          index++
        } else {
          clearInterval(interval)
        }
      }, 15)

      return () => clearInterval(interval)
    } else if (isUser || isLoading) {
      setDisplayedContent(content)
    }
  }, [content, isUser, isLoading])

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div className={`max-w-xs lg:max-w-md xl:max-w-lg flex flex-col gap-1`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{displayedContent}</p>
          {!isUser && isLoading && <span className="inline-block animate-pulse">▌</span>}
        </div>

        <span className="text-xs text-muted-foreground px-2">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
          <User className="h-4 w-4 text-accent" />
        </div>
      )}
    </div>
  )
}
