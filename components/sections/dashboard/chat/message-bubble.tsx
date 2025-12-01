"use client"

import { useEffect, useState } from "react"
import { Bot, User, Check, CheckCheck, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
  createdAt: string
  status?: "sending" | "sent" | "delivered" | "seen" | "failed"
  isLoading?: boolean
  isNew?: boolean
}

export function MessageBubble({ role, content, createdAt, status, isLoading, isNew }: MessageBubbleProps) {
  const [displayedContent, setDisplayedContent] = useState("")
  const isUser = role === "user"

  useEffect(() => {
    if (!isUser && content && isNew && !isLoading) {
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
    } else {
      setDisplayedContent(content)
    }
  }, [content, isUser, isNew, isLoading])

  const renderStatusIcon = () => {
    if (role !== "user" || !status) return null

    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-muted-foreground" />
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-primary" />
      case "failed":
        return <span className="text-destructive text-xs">Failed</span>
      default:
        return null
    }
  }

  const messageOpacity = isUser && status === "sending" ? "opacity-50" : "opacity-100"

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div className={`max-w-xs lg:max-w-md xl:max-w-lg flex flex-col gap-1`}>
        <div
          className={`px-4 py-2 rounded-lg transition-opacity ${messageOpacity} ${
            isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{displayedContent}</p>
          {!isUser && isLoading && <span className="inline-block animate-pulse">▌</span>}
        </div>

        <div className="flex items-center gap-1 px-2">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
          {renderStatusIcon()}
        </div>
      </div>

      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
          <User className="h-4 w-4 text-accent" />
        </div>
      )}
    </div>
  )
}
