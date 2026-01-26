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
import { Mic, Plus } from "lucide-react"

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
  isAtBottom?: boolean // New prop to indicate if input is at bottom of chat
}

export function ChatInput({
  onSend,
  isLoading,
  pointsBalance,
  pointCost,
  conversationId,
  role,
  isAtBottom = true, // Default to true for backward compatibility
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

  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null)


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

  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      toast.error("Voice input not supported in this browser")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setMessage(transcript)
    }

    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => setIsRecording(false)

    recognition.start()
    recognitionRef.current = recognition
    setIsRecording(true)
  }

  const stopVoiceInput = () => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }



  return (
    <div className={clsx(
      "p-2",
      isAtBottom ? "space-y-3 border-t border-border" : "space-y-2"
    )}>
      {/* Mode Selector */}
      {isAiMessage && (
        <div className={clsx(
          "flex gap-2",
          !isAtBottom && "justify-center"
        )}>
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
          // disabled={true}
          >
            <Video className="h-3 w-3" />
            Explainer Video
          </button>
        </div>
      )}

      {/* Credits Info */}
      {isAiMessage && (
        <div className={clsx(
          "text-xs",
          isAtBottom ? "flex items-center justify-between" : "flex items-center justify-center"
        )}>
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-muted-foreground">
              This request costs{" "}
              <span className="font-semibold">{effectiveCost} credits</span>
              {mode === "video" && " (video generation)"}
            </span>
          </div>
          {isAtBottom && (
            <span
              className={clsx(
                "font-semibold",
                pointsBalance < effectiveCost ? "text-destructive" : "text-success"
              )}
            >
              {pointsBalance} credits
            </span>
          )}
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
      <div className="flex justify-center mt-3">
        <div className="w-full">
          <div className="flex items-center gap-2 rounded-full bg-muted/60 px-2 py-1 shadow-sm">

            {/* Attach */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-foreground hover:text-foreground p-2"
            >
              <Plus className="h-5 w-5" />
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Text Input */}
            <input
              ref={inputRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              disabled={isLoading || isUploading || isJobRunning}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />

            {/* Mic */}
            <button
              onClick={isRecording ? stopVoiceInput : startVoiceInput}
              className={clsx(
                "transition",
                isRecording
                  ? "text-destructive animate-pulse"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Mic className="h-5 w-5" />
            </button>

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>


      {pointsBalance < effectiveCost && (
        <p className={clsx(
          "text-xs text-destructive",
          !isAtBottom && "text-center"
        )}>
          Insufficient credits. You need {effectiveCost - pointsBalance} more.
        </p>
      )}
    </div>
  )
}
