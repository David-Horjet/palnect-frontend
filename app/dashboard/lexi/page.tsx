"use client"

import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchConversations, getConversation, sendMessage, createConversation } from "@/store/slices/chatSlice"
import { fetchBalance } from "@/store/slices/pointsSlice"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, MessageCircle } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mobile"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { ChatInput } from "@/components/sections/dashboard/chat/chat-input"
import { ChatSidebar } from "@/components/sections/dashboard/chat/chat-sidebar"
import { MessageBubble } from "@/components/sections/dashboard/chat/message-bubble"

const POINT_COST_PER_MESSAGE = 10

export default function LexiChatPage() {
  const dispatch = useDispatch<AppDispatch>()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentConversation = useSelector((state: RootState) => state.chat.currentConversation)
  const messages = useSelector((state: RootState) => state.chat.messages)
  const messageLoading = useSelector((state: RootState) => state.chat.messageLoading)
  const chatLoading = useSelector((state: RootState) => state.chat.loading)

  const pointsBalance = useSelector((state: RootState) => state.points.balance)
  const user = useSelector((state: RootState) => state.auth.user)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
  }, [dispatch])

  const handleSelectConversation = async (conversationId: string) => {
    const token = localStorage.getItem("token")
    if (token) {
      await dispatch(getConversation({ token, conversationId }))
    }
  }

  const handleNewChat = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      const result = await dispatch(createConversation({ token }))
      if (result.payload) {
        handleSelectConversation((result.payload as any).id)
      }
    }
  }

  const handleSendMessage = async (message: string) => {
    const token = localStorage.getItem("token")
    if (!token) return

    if (pointsBalance < POINT_COST_PER_MESSAGE) {
      alert(`Insufficient points. You need ${POINT_COST_PER_MESSAGE} points to send a message.`)
      return
    }

    if (!currentConversation) {
      const result = await dispatch(createConversation({ token }))
      if (result.payload) {
        await dispatch(
          sendMessage({
            token,
            conversationId: (result.payload as any).id,
            message,
          }),
        )
      }
    } else {
      await dispatch(
        sendMessage({
          token,
          conversationId: currentConversation.id,
          message,
        }),
      )
    }
  }

  if (!isInitialized) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar activeTab="lexi" />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Initializing Lexi...</p>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="lexi" />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Chat Sidebar */}
        {!isMobile && (
          <div className="w-64 border-r border-border overflow-hidden">
            <ChatSidebar
              onSelectConversation={handleSelectConversation}
              currentConversationId={currentConversation?.id || null}
              isMobileOpen={mobileDrawerOpen}
            />
          </div>
        )}

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader title="Lexi - AI Study Mentor" subtitle="Your personal academic assistant" />

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!currentConversation || messages.length === 0 ? (
              /* Welcome State */
              <div className="flex items-center justify-center h-full">
                <Card className="max-w-md p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8 text-primary" />
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
              /* Messages Area */
              <div className="space-y-4">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    createdAt={msg.createdAt}
                    isLoading={messageLoading && msg.role === "assistant" && msg === messages[messages.length - 1]}
                  />
                ))}
                {messageLoading && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
                  <MessageBubble role="assistant" content="" createdAt={new Date().toISOString()} isLoading={true} />
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          {currentConversation && (
            <ChatInput
              onSend={handleSendMessage}
              isLoading={messageLoading}
              pointsBalance={pointsBalance}
              pointCost={POINT_COST_PER_MESSAGE}
            />
          )}
        </main>
      </div>

      {/* Mobile Sidebar */}
      {isMobile && mobileDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-sidebar">
            <ChatSidebar
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
