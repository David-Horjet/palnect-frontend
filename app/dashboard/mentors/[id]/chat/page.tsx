"use client"

import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchMentorDetail } from "@/store/slices/mentorsSlice"
import { fetchBalance } from "@/store/slices/pointsSlice"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MessageBubble } from "@/components/chat/message-bubble"
import { ChatInput } from "@/components/chat/chat-input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-mobile"
import { useSocket } from "@/hooks/useSocket"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { chatService } from "@/services/api/chat"

const POINT_COST_PER_MESSAGE = 15

export default function MentorChatPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useAuth()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { selectedMentor: mentor, loading: mentorLoading } = useSelector((state: RootState) => state.mentors)
  const pointsBalance = useSelector((state: RootState) => state.points.balance)
  const socket = useSocket()

  const [messages, setMessages] = useState<any[]>([])
  const [messageLoading, setMessageLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (token) {
      dispatch(fetchMentorDetail({ token, id: params.id }))
      dispatch(fetchBalance({ token }))
      loadMentorConversation()
    }
  }, [dispatch, token, params.id])

  const loadMentorConversation = async () => {
    if (!token) return
    try {
      setMessageLoading(true)
      const response = await chatService.getMentorConversation(token, params.id)
      setConversationId(response.data.id)
      setMessages(response.data.messages || [])
    } catch (error) {
      console.error("Failed to load conversation:", error)
    } finally {
      setMessageLoading(false)
    }
  }

  useEffect(() => {
    if (!socket || !conversationId) return

    const handleNewMessage = (data: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          role: data.role,
          content: data.content,
          createdAt: data.createdAt,
          status: "delivered",
          isNew: true,
        },
      ])
      setIsTyping(false)
    }

    const handleTyping = (data: any) => {
      if (data.mentorId === params.id) {
        setIsTyping(true)
      }
    }

    const handleStopTyping = (data: any) => {
      if (data.mentorId === params.id) {
        setIsTyping(false)
      }
    }

    socket.on("mentor:message", handleNewMessage)
    socket.on("mentor:typing", handleTyping)
    socket.on("mentor:stopTyping", handleStopTyping)

    return () => {
      socket.off("mentor:message", handleNewMessage)
      socket.off("mentor:typing", handleTyping)
      socket.off("mentor:stopTyping", handleStopTyping)
    }
  }, [socket, conversationId, params.id])

  const handleSendMessage = async (message: string) => {
    if (!token || !conversationId) return

    if (pointsBalance < POINT_COST_PER_MESSAGE) {
      alert(`Insufficient points. You need ${POINT_COST_PER_MESSAGE} points to send a message.`)
      return
    }

    const clientMessageId = `temp-${Date.now()}`
    const optimisticMessage = {
      id: clientMessageId,
      role: "user" as const,
      content: message,
      createdAt: new Date().toISOString(),
      status: "sending" as const,
      isNew: false,
    }

    setMessages((prev) => [...prev, optimisticMessage])

    try {
      setMessageLoading(true)
      await chatService.sendMentorMessage(token, params.id, message)

      setMessages((prev) => prev.map((msg) => (msg.id === clientMessageId ? { ...msg, status: "delivered" } : msg)))
    } catch (error) {
      console.error("Failed to send message:", error)
      setMessages((prev) => prev.map((msg) => (msg.id === clientMessageId ? { ...msg, status: "failed" } : msg)))
    } finally {
      setMessageLoading(false)
    }
  }

  if (mentorLoading || !mentor) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar activeTab="mentors" />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="mentors" />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-20 px-6 py-4">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/dashboard/mentors/${params.id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h2 className="font-bold text-foreground">
                  {mentor.user.first_name} {mentor.user.last_name}
                </h2>
                <p className="text-xs text-muted-foreground">Mentor</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold text-primary">{pointsBalance} pts</p>
              <p className="text-xs text-muted-foreground">{POINT_COST_PER_MESSAGE} pts per message</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Card className="max-w-md p-8 text-center space-y-4">
                <p className="text-muted-foreground">Start a conversation with {mentor.user.first_name}</p>
              </Card>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                createdAt={msg.createdAt}
                status={msg.status}
                isNew={msg.isNew}
                isLoading={false}
              />
            ))
          )}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
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
                <p className="text-sm text-muted-foreground italic">{mentor.user.first_name} is typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <ChatInput
          onSend={handleSendMessage}
          isLoading={messageLoading}
          pointsBalance={pointsBalance}
          pointCost={POINT_COST_PER_MESSAGE}
          conversationId={conversationId || ""}
        />
      </main>
    </div>
  )
}
