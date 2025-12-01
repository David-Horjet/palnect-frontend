import { apiClient } from "@/lib/api"

export interface Message {
  id: string
  conversationId: string
  role: "user" | "assistant"
  content: string
  status?: "sending" | "sent" | "delivered" | "failed"
  isNew?: boolean
  created_at: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface ChatResponse {
  success: boolean
  message: string
  data: {
    response: string
    pointsDeducted: number
    conversation: Conversation
  }
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
  async getConversations(token: string, page = 1, limit = 10) {
    return apiClient.get<ConversationsResponse>(`/chat/conversations?page=${page}&limit=${limit}`, token)
  },

  async getConversation(token: string, conversationId: string) {
    return apiClient.get<{ success: boolean; data: Conversation }>(`/chat/conversations/${conversationId}`, token)
  },

  async sendMessage(token: string, conversationId: string | null, clientMessageId: string, message: string) {
    const endpoint = conversationId ? `/chat/messages?conversationId=${conversationId}` : "/chat/messages"
    return apiClient.post<ChatResponse>(endpoint, { message, clientMessageId }, token)
  },

  async createConversation(token: string) {
    return apiClient.post<{ success: boolean; data: Conversation }>("/chat/conversations", {}, token)
  },

  async deleteConversation(token: string, conversationId: string) {
    return apiClient.delete(`/chat/conversations/${conversationId}`, token)
  },
}
