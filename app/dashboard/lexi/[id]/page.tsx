"use client"

import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import {
  getConversation,
  sendMessage,
  setTyping,
  clearCurrentConversation,
  addIncomingMessage,
  updateMessage,
} from "@/store/slices/chatSlice"
import { fetchBalance } from "@/store/slices/pointsSlice"
import { Card } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { useSocket } from "@/hooks/useSocket"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { ChatInput } from "@/components/sections/dashboard/chat/chat-input"
import { MessageBubble } from "@/components/sections/dashboard/chat/message-bubble"
import Image from "next/image"
import robot from "../../../../public/gifs/robot.gif"
import { jobProgressUpdated, jobCompleted, jobFailed, clearJob as clearGenerationJob } from "@/store/slices/generationSlice"
import { GenerationProgress } from "@/components/sections/dashboard/chat/generation-progress"
import Link from "next/link"
import { useRouter } from "next/navigation"

const POINT_COST_PER_MESSAGE = 10

export default function LexiConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const unwrappedParams = React.use(params)

  const currentConversation = useSelector((state: RootState) => state.chat.currentConversation)
  const messages = useSelector((state: RootState) => state.chat.messages)
  const messageLoading = useSelector((state: RootState) => state.chat.messageLoading)
  const pointsBalance = useSelector((state: RootState) => state.points.balance)
  const user = useSelector((state: RootState) => state.auth.user)
  const socket = useSocket()
  const isTyping = useSelector((state: RootState) => state.chat.isTyping)

  console.log("Current Conversation:", currentConversation, messages)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const initialize = async () => {
      try {
        await dispatch(fetchBalance({ token }))
        await dispatch(getConversation({ token, conversationId: unwrappedParams.id }))
        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize conversation:", error)
        setIsInitialized(true)
      }
    }

    initialize()

    return () => {
      dispatch(clearCurrentConversation())
    }
  }, [dispatch, unwrappedParams.id])

  useEffect(() => {
    if (!socket) return

    const onProgress = (data: any) => {
      dispatch(
        jobProgressUpdated({
          status: data.status,
          stage: data.stage,
          progress: data.progress,
          message: data.message,
        })
      )
    }

    const onCompleted = (data: any) => {
      dispatch(jobCompleted({ videoUrl: data.videoUrl }))
      setTimeout(() => {
        dispatch(clearGenerationJob())
      }, 2500)
    }

    const onFailed = (data: any) => {
      dispatch(jobFailed({ error: data.error }))
      setTimeout(() => {
        dispatch(clearGenerationJob())
      }, 3000)
    }

    socket.on("generation:progress", onProgress)
    socket.on("generation:completed", onCompleted)
    socket.on("generation:failed", onFailed)

    return () => {
      socket.off("generation:progress", onProgress)
      socket.off("generation:completed", onCompleted)
      socket.off("generation:failed", onFailed)
    }
  }, [socket, dispatch])

  useEffect(() => {
    if (!socket || !currentConversation) return

    socket.emit("joinConversation", currentConversation.id)

    return () => {
      socket.emit("leaveConversation", currentConversation.id)
    }
  }, [socket, currentConversation])

  useEffect(() => {
    if (!socket || !currentConversation) return

    const handleNewMessage = (data: any) => {
      if (data.conversationId === currentConversation.id) {
        dispatch(
          addIncomingMessage({
            conversationId: data.conversationId,
            message: {
              id: data.id,
              conversation_id: data.conversationId,
              role: "assistant",
              content: data.content,
              created_at: data.createdAt || new Date().toISOString(),
              status: "delivered",
              isNew: true,
              sender_id: data.senderId,
              attachments: data.attachments || [],
              is_deleted: false,
            },
          })
        )
      }
    }

    const handleTyping = (data: any) => {
      if (data.conversationId === currentConversation.id) {
        dispatch(setTyping(true))
      }
    }

    const handleStopTyping = (data: any) => {
      if (data.conversationId === currentConversation.id) {
        dispatch(setTyping(false))
      }
    }

    const handleMessageUpdate = (data: any) => {
      if (data?.message && data.message.conversation_id === currentConversation?.id) {
        dispatch(updateMessage(data.message))
      }
    }

    socket.on("ai:message", handleNewMessage)
    socket.on("ai:typing", handleTyping)
    socket.on("ai:stopTyping", handleStopTyping)
    socket.on("message:update", handleMessageUpdate)

    return () => {
      socket.off("ai:message", handleNewMessage)
      socket.off("ai:typing", handleTyping)
      socket.off("ai:stopTyping", handleStopTyping)
      socket.off("message:update", handleMessageUpdate)
    }
  }, [socket, currentConversation, dispatch])

  const handleSendMessage = async (message: string, attachments?: Array<{ url: string; type: string; name?: string }>, mode?: "text" | "video") => {
    const token = localStorage.getItem("token")
    if (!token || !currentConversation) return

    if (pointsBalance < POINT_COST_PER_MESSAGE) {
      alert(`Insufficient points. You need ${POINT_COST_PER_MESSAGE} points to send a message.`)
      return
    }

    const clientMessageId = `temp-${Date.now()}`

    await dispatch(
      sendMessage({
        token,
        conversationId: currentConversation.id,
        message,
        mode,
        attachments,
        clientMessageId,
        senderId: user?.id!,
      })
    )
  }

  if (!isInitialized) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar activeTab="lexi" />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="lexi" />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header with back button */}
        <div className="border-b border-border px-6 py-3 flex items-center gap-3">
          <Link href="/dashboard/lexi" className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h2 className="font-semibold flex-1">Lexi</h2>
        </div>

        <DashboardHeader title="Chat" subtitle="Conversation with your academic assistant" />

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-2 md:p-6 space-y-6">
          {!currentConversation || messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Card className="max-w-2xl w-full bg-transparent border-none text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Image src={robot} alt="robot" width={100} height={100} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Hi, I'm Lexi!</h2>
                  <p className="text-muted-foreground">
                    I'm your AI study mentor here to help you with any academic questions.
                  </p>
                </div>
                <div>
                  <ChatInput
                    onSend={handleSendMessage}
                    isLoading={messageLoading}
                    pointsBalance={pointsBalance}
                    pointCost={POINT_COST_PER_MESSAGE}
                    role="assistant"
                    isAtBottom={false}
                  />
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  createdAt={msg.created_at}
                  attachments={msg.attachments}
                  status={msg.status}
                  isNew={msg.isNew}
                  isLoading={false}
                  senderId={msg.sender_id}
                  currentUserId={user?.id}
                />
              ))}
              <GenerationProgress />
              {isTyping && (
                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-muted text-foreground rounded-lg rounded-bl-none px-4 py-2">
                    <p className="text-sm text-muted-foreground italic">Lexi is typing...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat input */}
        {currentConversation && (
          <ChatInput
            onSend={handleSendMessage}
            isLoading={messageLoading}
            pointsBalance={pointsBalance}
            pointCost={POINT_COST_PER_MESSAGE}
            conversationId={currentConversation.id}
            role="assistant"
            isAtBottom={true}
          />
        )}
      </main>
    </div>
  )
}
