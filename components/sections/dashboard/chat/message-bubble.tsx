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
  senderId?: string
  currentUserId?: string
}

export function MessageBubble({
  role,
  content,
  createdAt,
  status,
  isLoading,
  isNew,
  senderId,
  currentUserId,
}: MessageBubbleProps) {
  const [displayedContent, setDisplayedContent] = useState("")

  const isCurrentUserMessage = senderId === currentUserId
  const isAiMessage = role === "assistant"
  const isUserMessage = role === "user" 

  useEffect(() => {
    if (isAiMessage && content && isNew && !isLoading) {
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
  }, [content, isAiMessage, isNew, isLoading])

  const renderStatusIcon = () => {
    if (!isUserMessage || !status) return null

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

  const messageOpacity = isUserMessage && status === "sending" ? "opacity-50" : "opacity-100"

  return (
    <div className={`flex gap-3 ${isUserMessage && isCurrentUserMessage ? "justify-end" : "justify-start"}`}>
      {!isUserMessage || !isCurrentUserMessage ? (
        <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          {isAiMessage ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-primary" />}
        </div>
      ) : null}

      <div className={`max-w-xs lg:max-w-md xl:max-w-lg flex flex-col gap-1`}>
        <div
          className={`px-4 py-2 rounded-lg transition-opacity ${messageOpacity} ${
            isUserMessage && isCurrentUserMessage
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted text-foreground rounded-bl-none"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{displayedContent}</p>
          {isAiMessage && isLoading && <span className="inline-block animate-pulse">▌</span>}
        </div>

        <div className="flex items-center gap-1 px-2">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
          {renderStatusIcon()}
        </div>
      </div>

      {isUserMessage && isCurrentUserMessage && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
          <User className="h-4 w-4 text-accent" />
        </div>
      )}
    </div>
  )
}
