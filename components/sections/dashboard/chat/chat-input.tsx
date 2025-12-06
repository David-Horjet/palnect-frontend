"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Zap } from "lucide-react"
import { useSocket } from "@/hooks/useSocket"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  role: "user" | "assistant"
  pointsBalance: number
  pointCost: number
  conversationId?: string
}

export function ChatInput({ onSend, isLoading, pointsBalance, pointCost, conversationId, role }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [canSend, setCanSend] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const socket = useSocket()
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isAiMessage = role === "assistant"

  useEffect(() => {
    setCanSend(message.trim().length > 0 && pointsBalance >= pointCost && !isLoading)
  }, [message, pointsBalance, pointCost, isLoading])

  const handleSend = () => {
    if (canSend) {
      onSend(message)
      setMessage("")
      inputRef.current?.focus()
    }
  }

  const handleKeyDown: any = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && canSend) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTyping = () => {
    if (!socket || !conversationId) return

    socket.emit("typing", { conversationId, isTyping: true })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { conversationId, isTyping: false })
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    handleTyping()
  }

  return (
    <div className="border-t border-border p-4 space-y-2">
      {/* Points Info */}
      {isAiMessage && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-muted-foreground">
              Each message costs <span className="font-semibold">{pointCost} credits</span>
            </span>
          </div>
          <span className={`font-semibold ${pointsBalance < pointCost ? "text-destructive" : "text-success"}`}>
            {pointsBalance} credits available
          </span>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder={`${isAiMessage ? "Ask Lexi anything..." : "Type Something..."}`}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading || pointsBalance < pointCost}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!canSend} size="md" className="shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {pointsBalance < pointCost && (
        <p className="text-xs text-destructive">
          Insufficient points. You need {pointCost - pointsBalance} more points.
        </p>
      )}
    </div>
  )
}
