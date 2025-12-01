"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { createConversation, deleteConversation } from "@/store/slices/chatSlice"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, ChevronLeft } from "lucide-react"
import Link from "next/link"

interface ChatSidebarProps {
  onSelectConversation: (conversationId: string) => void
  currentConversationId: string | null
  isMobileOpen: boolean
  onClose?: () => void
}

export function ChatSidebar({ onSelectConversation, currentConversationId, isMobileOpen, onClose }: ChatSidebarProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [isCreating, setIsCreating] = useState(false)

  const conversations = useSelector((state: RootState) => state.chat.conversations)
  console.log("Conversations:", conversations)
  const loading = useSelector((state: RootState) => state.chat.loading)

  const handleNewChat = async () => {
    setIsCreating(true)
    const token = localStorage.getItem("token")
    if (token) {
      const result = await dispatch(createConversation({ token }))
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
        <h2 className="text-lg font-bold text-sidebar-foreground flex-1">Chat History</h2>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button onClick={handleNewChat} disabled={isCreating} className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? "Creating..." : "New Chat"}
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2">
        {loading ? (
          <Card className="p-4 text-center text-sm text-muted-foreground">Loading chats...</Card>
        ) : conversations.length > 0 ? (
          conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => {
                onSelectConversation(conversation.id)
                onClose?.()
              }}
              className={`w-full text-left p-3 rounded-lg transition-all group ${
                currentConversationId === conversation.id
                  ? "bg-sidebar-primary/20 border border-sidebar-primary/50"
                  : "hover:bg-sidebar-accent/10"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{conversation.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(conversation.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  className="p-1 hover:bg-destructive/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </button>
          ))
        ) : (
          <Card className="p-4 text-center text-sm text-muted-foreground">No conversations yet. Start a new chat!</Card>
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
