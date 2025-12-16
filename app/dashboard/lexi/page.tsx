"use client"

import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import {
  fetchConversations,
  getConversation,
  sendMessage,
  createConversation,
  setTyping,
  clearCurrentConversation,
  addIncomingMessage,
} from "@/store/slices/chatSlice"
import { fetchBalance } from "@/store/slices/pointsSlice"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, MessageCircle, Bot, ChevronLeft } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mobile"
import { useSocket } from "@/hooks/useSocket"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { ChatInput } from "@/components/sections/dashboard/chat/chat-input"
import { ChatSidebar } from "@/components/sections/dashboard/chat/chat-sidebar"
import { MessageBubble } from "@/components/sections/dashboard/chat/message-bubble"
import Image from "next/image"
import robot from "../../../public/gifs/robot.gif";

const POINT_COST_PER_MESSAGE = 10

export default function LexiChatPage() {
  const dispatch = useDispatch<AppDispatch>()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showSidebarOnly, setShowSidebarOnly] = useState(isMobile)

  const allConversations = useSelector((state: RootState) => state.chat.conversations)
  const currentConversation = useSelector((state: RootState) => state.chat.currentConversation)
  const messages = useSelector((state: RootState) => state.chat.messages)
  const messageLoading = useSelector((state: RootState) => state.chat.messageLoading)
  const chatLoading = useSelector((state: RootState) => state.chat.loading)
  const pointsBalance = useSelector((state: RootState) => state.points.balance)
  const user = useSelector((state: RootState) => state.auth.user)
  const socket = useSocket()
  const isTyping = useSelector((state: RootState) => state.chat.isTyping)

  const lexiConversations = allConversations.filter((conv) => conv.type === "lexi_ai")

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
        await dispatch(fetchConversations({ token, page: 1, limit: 20 }))
        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize chat:", error)
      }
    }

    initialize()

    dispatch(clearCurrentConversation())
  }, [dispatch])

  useEffect(() => {
    if (!socket || !currentConversation) return

    const handleNewMessage = (data: any) => {
      if (data.conversationId === currentConversation.id) {
        dispatch(
          addIncomingMessage({
            id: data.id,
            conversation_id: data.conversationId,
            role: "assistant",
            content: data.content,
            created_at: data.createdAt || new Date().toISOString(),
            status: "delivered",
            isNew: true,
            sender_id: data.senderId,
            is_deleted: false,
          }),
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

    socket.on("ai:message", handleNewMessage)
    socket.on("ai:typing", handleTyping)
    socket.on("ai:stopTyping", handleStopTyping)

    return () => {
      socket.off("ai:message", handleNewMessage)
      socket.off("ai:typing", handleTyping)
      socket.off("ai:stopTyping", handleStopTyping)
    }
  }, [socket, currentConversation, dispatch])

  const handleSelectConversation = async (conversationId: string) => {
    const token = localStorage.getItem("token")
    if (token) {
      await dispatch(getConversation({ token, conversationId }))
      if (isMobile) {
        setShowSidebarOnly(false)
      }
    }
  }

  const handleNewChat = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      const result = await dispatch(createConversation({ token, type: "lexi_ai" }))
      if (result.payload) {
        handleSelectConversation((result.payload as any).id)
      }
    }
  }

  const handleSendMessage = async (message: string, attachments?: {
    url: string
    type: string
    name?: string
  }[]) => {
    const token = localStorage.getItem("token")
    if (!token) return

    if (pointsBalance < POINT_COST_PER_MESSAGE) {
      alert(`Insufficient points. You need ${POINT_COST_PER_MESSAGE} points to send a message.`)
      return
    }

    const clientMessageId = `temp-${Date.now()}`

    if (!currentConversation) {
      const result = await dispatch(createConversation({ token, type: "lexi_ai" }))
      if (result.payload) {
        await dispatch(
          sendMessage({
            token,
            conversationId: (result.payload as any).id,
            message,
            attachments,
            clientMessageId,
            senderId: user?.id!
          }),
        )
      }
    } else {
      await dispatch(
        sendMessage({
          token,
          conversationId: currentConversation.id,
          message,
          attachments,
          clientMessageId,
          senderId: user?.id!
        }),
      )
    }
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

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {(!isMobile || showSidebarOnly) && (
          <div className={`${isMobile ? "w-full" : "w-64"} border-r border-border overflow-hidden flex flex-col`}>
            <ChatSidebar
              conversations={lexiConversations}
              onSelectConversation={handleSelectConversation}
              currentConversationId={currentConversation?.id || null}
              isMobileOpen={mobileDrawerOpen}
            />
          </div>
        )}

        {(!isMobile || !showSidebarOnly) && (
          <main className="flex-1 flex flex-col overflow-hidden">
            {isMobile && !showSidebarOnly && (
              <div className="border-b border-border px-4 py-3 flex items-center gap-3">
                <button onClick={() => setShowSidebarOnly(true)} className="p-2 hover:bg-accent/10 rounded-lg">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="font-semibold flex-1">Lexi</h2>
              </div>
            )}
            <DashboardHeader title="Lexi - AI Study Mentor" subtitle="Your personal academic assistant" />

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!currentConversation || messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Card className="max-w-md p-8 bg-transparent border-none text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <Image src={robot} alt={"robot"} width={100} height={100} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-foreground">Hi, I'm Lexi!</h2>
                      <p className="text-muted-foreground">
                        I'm your sweet and gentle AI study mentor here to help you with any academic questions.
                      </p>
                    </div>
                    <div className="space-y-3 pt-4">
                      <p className="text-sm text-muted-foreground">What do you need help with today?</p>
                      <Button onClick={handleNewChat} className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Start a New Chat
                      </Button>
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

            {currentConversation && (
              <ChatInput
                onSend={handleSendMessage}
                isLoading={messageLoading}
                pointsBalance={pointsBalance}
                pointCost={POINT_COST_PER_MESSAGE}
                conversationId={currentConversation.id}
                role={currentConversation.type === "lexi_ai" ? "assistant" : "user"}
              />
            )}
          </main>

        )}
      </div>

      {isMobile && mobileDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-sidebar">
            <ChatSidebar
              conversations={lexiConversations}
              onSelectConversation={handleSelectConversation}
              currentConversationId={currentConversation?.id || null}
              isMobileOpen={mobileDrawerOpen}
              onClose={() => setMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
