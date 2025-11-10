import { apiClient } from "@/lib/api"

export interface AIResponse {
  summary: string
  provider: string
}

export interface AISummarizeResponse {
  success: boolean
  message: string
  data: AIResponse
}

export const aiService = {
  // Generate AI summary for a resource
  async summarizeResource(token: string, resourceId: string, provider = "chatgpt") {
    return apiClient.get<AISummarizeResponse>(`/ai/summarize/${resourceId}?provider=${provider}`, token)
  },
}
