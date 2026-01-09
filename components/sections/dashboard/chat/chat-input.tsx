"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Zap, Paperclip, Video } from "lucide-react"
import { useSocket } from "@/hooks/useSocket"
import { AttachmentPreview } from "./attachment-preview"
import uploadService from "@/services/api/upload"
import { toast } from "@/lib/toast"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import clsx from "clsx"

interface Attachment {
  url: string
  type: string
  name?: string
}

type GenerationMode = "text" | "video"

interface ChatInputProps {
  onSend: (message: string, attachments?: Attachment[], mode?: GenerationMode) => void
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

  const [mode, setMode] = useState<GenerationMode>("text")

  const VIDEO_MULTIPLIER = 5
  const effectiveCost = mode === "video" ? pointCost * VIDEO_MULTIPLIER : pointCost

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



  const activeJob = useSelector(
    (state: RootState) => state.generation.activeJob
  )

  const isJobRunning: boolean =
    activeJob &&
    activeJob.status !== "completed" &&
    activeJob.status !== "failed" ? true : false

  useEffect(() => {
    setCanSend(
      (message.trim().length > 0 || uploadedAttachment !== null) &&
      pointsBalance >= effectiveCost &&
      !isLoading &&
      !isUploading &&
      !isJobRunning 
    )
  }, [
    message,
    uploadedAttachment,
    pointsBalance,
    effectiveCost,
    isLoading,
    isUploading,
    isJobRunning,
  ])


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

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB")
      return
    }

    setSelectedFile(file)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadedFile = await uploadService.uploadChatAttachment(
        file,
        setUploadProgress,
        token
      )

      console.log("Uploaded file:", uploadedFile)

      setUploadedAttachment({
        url: uploadedFile.publicUrl,
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
    onSend(message, attachments, mode)

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
    <div className="border-t border-border p-3 md:p-4 space-y-3">
      {/* Mode Selector */}
      {isAiMessage && (
        <div className="flex gap-2"> 
          <button  
            onClick={() => setMode("text")}
            className={clsx(
              "px-3 py-1.5 rounded-full text-xs font-medium transition",
              mode === "text"
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:bg-muted/80" 
            )}  
          >
            Text
          </button>  

          <button
            onClick={() => setMode("video")}
            className={clsx(
              "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition",
              mode === "video"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            disabled={true}
          >
            <Video className="h-3 w-3" />
            Explainer Video
          </button>
        </div>
      )}

      {/* Credits Info */}
      {isAiMessage && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-muted-foreground">
              This request costs{" "}
              <span className="font-semibold">{effectiveCost} credits</span>
              {mode === "video" && " (video generation)"}
            </span>
          </div>

          <span
            className={clsx(
              "font-semibold",
              pointsBalance < effectiveCost ? "text-destructive" : "text-success"
            )}
          >
            {pointsBalance} credits
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
          placeholder={
            mode === "video"
              ? "Describe the explainer video you want (e.g. explain like I’m 10)…"
              : "Ask Lexi to summarize or explain the material…"
          }
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading || pointsBalance < effectiveCost || isUploading || isJobRunning}
          className="flex-1"
        />

        <Button  onClick={handleSend} disabled={!canSend || isJobRunning} size="md">
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {pointsBalance < effectiveCost && (
        <p className="text-xs text-destructive">
          Insufficient credits. You need {effectiveCost - pointsBalance} more.
        </p>
      )}
    </div>
  )
}
