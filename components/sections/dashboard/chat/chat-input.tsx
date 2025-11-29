"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Zap } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  pointsBalance: number
  pointCost: number
}

export function ChatInput({ onSend, isLoading, pointsBalance, pointCost }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [canSend, setCanSend] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && canSend) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border p-4 space-y-2">
      {/* Points Info */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Zap className="h-3 w-3 text-primary" />
          <span className="text-muted-foreground">
            Each message costs <span className="font-semibold">{pointCost} points</span>
          </span>
        </div>
        <span className={`font-semibold ${pointsBalance < pointCost ? "text-destructive" : "text-success"}`}>
          {pointsBalance} points available
        </span>
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder="Ask Lexi anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || pointsBalance < pointCost}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!canSend} size="icon" className="flex-shrink-0">
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
