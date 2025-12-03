import { apiClient } from "@/lib/api"

export type ConversationType = "lexi_ai" | "peer" | "mentor" | "group"

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  role: "user" | "assistant"
  content: string
  status: "sent" | "sending" | "delivered" | "seen" | "failed"
  attachments?: Array<{ url: string; type: string }>
  client_message_id?: string
  is_deleted: boolean
  created_at: string
  sender?: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
  }
  isNew?: boolean
}

export interface Conversation {
  id: string
  type: ConversationType
  title?: string
  participants: string[]
  last_message_at?: string
  last_message_preview?: string
  metadata?: any
  is_deleted: boolean
  created_at: string
  updated_at: string
  messages: Message[]
  unread_count?: number
}

export interface ConversationsResponse {
  success: boolean
  message: string
  data: Conversation[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const chatService = {
  // Get all conversations (unified endpoint for all types)
  async getConversations(token: string, page = 1, limit = 20) {
    return apiClient.get<ConversationsResponse>(`/chat/conversations?page=${page}&limit=${limit}`, token)
  },

  // Get specific conversation by ID
  async getConversation(token: string, conversationId: string) {
    return apiClient.get<{ success: boolean; data: Conversation }>(`/chat/conversations/${conversationId}`, token)
  },

  // Send message (works for all conversation types)
  async sendMessage(token: string, conversationId: string, clientMessageId: string, message: string) {
    // Server returns { success, message, data: { response, pointsDeducted, conversation } }
    return apiClient.post<{
      success: boolean
      message: string
      data: { response: string; pointsDeducted: number; conversation: Conversation }
    }>(`/chat/messages?conversationId=${conversationId}`, { message, clientMessageId }, token)
  },

  // Create new conversation (for peers)
  async createConversation(
    token: string,
    type: "lexi_ai" | "peer" | "mentor" | "group" = "peer",
    recipientId?: string,
    participants?: string[],
  ) {
    return apiClient.post<{ success: boolean; data: Conversation }>(
      "/chat/conversations",
      { type, recipientId, participants },
      token,
    )
  },

  // Get or create mentor conversation
  async getMentorConversation(token: string, mentorId: string, userId: string) {
    return apiClient.post<{ success: boolean; data: Conversation }>(
      "/chat/conversations",
      { type: "mentor", mentorId, participants: [userId, mentorId] },
      token,
    )
  },

  // Delete conversation
  async deleteConversation(token: string, conversationId: string) {
    return apiClient.delete(`/chat/conversations/${conversationId}`, token)
  },
}
