"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Zap, Paperclip } from "lucide-react"
import { useSocket } from "@/hooks/useSocket"
import { AttachmentPreview } from "./attachment-preview"
import uploadService from "@/services/api/upload"
import { toast } from "@/lib/toast"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

interface Attachment {
  url: string
  type: string
  name?: string
}

interface ChatInputProps {
  onSend: (message: string, attachments?: Attachment[]) => void
  isLoading: boolean
  role: "user" | "assistant"
  pointsBalance: number
  pointCost: number
  conversationId?: string
}

export function ChatInput({
  onSend,
  isLoading,
  pointsBalance,
  pointCost,
  conversationId,
  role,
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [canSend, setCanSend] = useState(false)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedAttachment, setUploadedAttachment] = useState<Attachment | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const socket = useSocket()
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { token } = useSelector((state: RootState) => state.auth)
  const isAiMessage = role === "assistant"

  useEffect(() => {
    setCanSend(
      (message.trim().length > 0 || uploadedAttachment !== null) &&
        pointsBalance >= pointCost &&
        !isLoading &&
        !isUploading
    )
  }, [message, uploadedAttachment, pointsBalance, pointCost, isLoading, isUploading])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token) return

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and DOCX files are allowed")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    setSelectedFile(file)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadedFile = await uploadService.uploadChatAttachment(
        file,
        token,
        setUploadProgress
      )

      setUploadedAttachment({
        url: uploadedFile.url,
        type: uploadedFile.type,
        name: file.name,
      })

      toast.success("File uploaded successfully")
    } catch {
      toast.error("Failed to upload file")
      setSelectedFile(null)
    } finally {
      setIsUploading(false)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveFile = async () => {
    if (uploadedAttachment && token) {
      try {
        await uploadService.deleteAttachment(uploadedAttachment.url, token)
      } catch (err) {
        console.error("Failed to delete attachment:", err)
      }
    }

    setSelectedFile(null)
    setUploadedAttachment(null)
    setUploadProgress(0)
  }

  const handleSend = () => {
    if (!canSend) return

    const attachments = uploadedAttachment ? [uploadedAttachment] : undefined
    onSend(message, attachments)

    setMessage("")
    setSelectedFile(null)
    setUploadedAttachment(null)
    setUploadProgress(0)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && canSend) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTyping = () => {
    if (!socket || !conversationId) return

    socket.emit("typing", { conversationId, isTyping: true })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

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

      {selectedFile && (
        <AttachmentPreview
          file={selectedFile}
          uploadProgress={uploadProgress}
          onRemove={handleRemoveFile}
        />
      )}

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isUploading || uploadedAttachment !== null}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <Input
          ref={inputRef}
          placeholder={isAiMessage ? "Ask Lexi anything..." : "Type something..."}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading || pointsBalance < pointCost || isUploading}
          className="flex-1"
        />

        <Button onClick={handleSend} disabled={!canSend} size="md">
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
