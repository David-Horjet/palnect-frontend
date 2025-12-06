"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { createConversation, deleteConversation } from "@/store/slices/chatSlice"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, ChevronLeft, MessageCircle, Sparkles, Users, Bot } from "lucide-react"
import Link from "next/link"
import type { Conversation } from "@/services/api/chat"
import Image from "next/image"

interface ChatSidebarProps {
  onSelectConversation: (conversationId: string) => void
  currentConversationId: string | null
  isMobileOpen: boolean
  conversations: Conversation[]
  onClose?: () => void
}

function getConversationIcon(type: string) {
  switch (type) {
    case "lexi_ai":
      return <Sparkles className="h-4 w-4 text-primary" />
    case "mentor":
      return <MessageCircle className="h-4 w-4 text-accent" />
    case "group":
      return <Users className="h-4 w-4 text-secondary" />
    case "peer":
    default:
      return <MessageCircle className="h-4 w-4 text-muted-foreground" />
  }
}

export function ChatSidebar({ onSelectConversation, currentConversationId, conversations, isMobileOpen, onClose }: ChatSidebarProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [isCreating, setIsCreating] = useState(false)

  // const conversations = useSelector((state: RootState) => state.chat.conversations)
  const loading = useSelector((state: RootState) => state.chat.loading)

  const handleNewChat = async () => {
    setIsCreating(true)
    const token = localStorage.getItem("token")
    if (token) {
      const result = await dispatch(createConversation({
        token,
        type: "lexi_ai"
      }))
      if (result.payload) {
        onSelectConversation((result.payload as any).id)
      }
    }
    setIsCreating(false)
  }

  const handleDeleteConversation = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation()
    const token = localStorage.getItem("token")
    if (token) {
      await dispatch(deleteConversation({ token, conversationId }))
    }
  }

  return (
    <div className={`flex flex-col h-full bg-sidebar border-r border-sidebar-border overflow-hidden`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-foreground md:hidden">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-lg font-bold text-sidebar-foreground flex-1">Messages</h2>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2 py-4">
        {loading ? (
          <Card className="p-4 text-center text-sm text-muted-foreground">Loading messages...</Card>
        ) : conversations.length > 0 ? (
          conversations.map((conversation: Conversation) => (
            <button
              key={conversation.id}
              onClick={() => {
                onSelectConversation(conversation.id)
                onClose?.()
              }}
              className={`w-full text-left p-3 rounded-lg transition-all group ${currentConversationId === conversation.id
                ? "bg-sidebar-primary/20 border border-sidebar-primary/50"
                : "hover:bg-sidebar-accent/10"
                }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  {conversation.participant && conversation.type !== "lexi_ai" ? (
                    <div className="">
                      {conversation.participant.avatar_url ? (
                        <Image
                          src={conversation.participant.avatar_url || "/placeholder.svg"}
                          alt="Avatar"
                          className="h-8 md:h-10 w-8 md:w-10 rounded-full object-cover"
                          width={100}
                          height={100}
                        />
                      ) : (
                        <div className="h-8 md:h-10 w-8 md:w-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-base font-bold text-primary-foreground">
                          {conversation.participant.first_name.trim()[0]}
                          {conversation.participant.last_name.trim()[0]}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-8 md:h-10 w-8 md:w-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-base font-bold text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{conversation.type !== "lexi_ai" ? conversation?.participant.first_name : conversation.title} {conversation.type !== "lexi_ai" && conversation?.participant.last_name}</p>
                    <p className="text-xs mt-1 text-muted-foreground truncate">{conversation.last_message_preview}</p>
                    {conversation.unread_count && conversation.unread_count > 0 && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-accent text-white text-xs rounded-full">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  className="p-1 hover:bg-destructive/20 rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </button>
          ))
        ) : (
          <Card className="p-4 text-center text-sm text-muted-foreground">No messages yet. Start chatting!</Card>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button variant="outline" size="sm" className="w-full bg-transparent">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
