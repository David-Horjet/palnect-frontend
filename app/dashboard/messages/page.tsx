"use client"

import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "next/navigation"
import type { AppDispatch, RootState } from "@/store/store"
import { createConversation, fetchConversations, getConversation, sendMessage } from "@/store/slices/chatSlice"
import { fetchBalance } from "@/store/slices/pointsSlice"
import { Card } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mobile"
import { useSocket } from "@/hooks/useSocket"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { ChatInput } from "@/components/sections/dashboard/chat/chat-input"
import { ChatSidebar } from "@/components/sections/dashboard/chat/chat-sidebar"
import { MessageBubble } from "@/components/sections/dashboard/chat/message-bubble"

const POINT_COST_PER_MESSAGE = 5

export default function MessagesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const allConversations = useSelector((state: RootState) => state.chat.conversations)
  const currentConversation = useSelector((state: RootState) => state.chat.currentConversation)
  const messages = useSelector((state: RootState) => state.chat.messages)
  const messageLoading = useSelector((state: RootState) => state.chat.messageLoading)
  const pointsBalance = useSelector((state: RootState) => state.points.balance)
  const user = useSelector((state: RootState) => state.auth.user)
  const socket = useSocket()
  const isTyping = useSelector((state: RootState) => state.chat.isTyping)

  const nonAiConversations = allConversations.filter(
    (conv) => conv.type === "peer" || conv.type === "mentor" || conv.type === "group",
  )

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

        const mentorId = searchParams?.get("mentorId") || searchParams?.get("userId")
        const userId = user?.id

        if (mentorId && userId) {
          const existingConversation = nonAiConversations.find(
            (conv) => conv.participants?.includes(mentorId) && conv.participants?.includes(userId),
          )

          if (existingConversation) {
            await dispatch(getConversation({ token, conversationId: existingConversation.id }))
          } else {
            const conversationType = searchParams?.get("mentorId") ? "mentor" : "peer"
            const participants = [userId, mentorId]
            await dispatch(
              createConversation({
                token,
                type: conversationType,
                recipientId: mentorId,
                participants,
              }),
            )
          }
        }

        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize messages:", error)
        setIsInitialized(true)
      }
    }

    initialize()
  }, [dispatch, searchParams, user?.id])

  const handleSelectConversation = async (conversationId: string) => {
    const token = localStorage.getItem("token")
    if (token) {
      await dispatch(getConversation({ token, conversationId }))
    }
  }

  const handleSendMessage = async (message: string) => {
    const token = localStorage.getItem("token")
    if (!token) return

    if (pointsBalance < POINT_COST_PER_MESSAGE) {
      alert(`Insufficient points. You need ${POINT_COST_PER_MESSAGE} points to send a message.`)
      return
    }

    const clientMessageId = `temp-${Date.now()}`

    if (currentConversation) {
      await dispatch(
        sendMessage({
          token,
          conversationId: currentConversation.id,
          message,
          clientMessageId,
          senderId: ""
        }),
      )
    }
  }

  if (!isInitialized) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar activeTab="messages" />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Initializing messages...</p>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="messages" />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {!isMobile && (
          <div className="w-64 border-r border-border overflow-hidden">
            <ChatSidebar
              conversations={nonAiConversations}
              onSelectConversation={handleSelectConversation}
              currentConversationId={currentConversation?.id || null}
              isMobileOpen={mobileDrawerOpen}
            />
          </div>
        )}

        <main className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader
            title={currentConversation ? currentConversation.title || "Conversation" : "Messages"}
            subtitle={
              currentConversation?.type === "mentor"
                ? "Chat with your mentor"
                : currentConversation?.type === "group"
                  ? "Group conversation"
                  : "Direct message"
            }
          />

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!currentConversation || messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Card className="max-w-md p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">Welcome to Messages</h2>
                    <p className="text-muted-foreground">Select a conversation from the sidebar to begin chatting.</p>
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
                    status={msg.status}
                    isNew={msg.isNew}
                    isLoading={false}
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
                      <p className="text-sm text-muted-foreground italic">Typing...</p>
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
            />
          )}
        </main>
      </div>

      {isMobile && mobileDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-sidebar">
            <ChatSidebar
              conversations={nonAiConversations}
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
