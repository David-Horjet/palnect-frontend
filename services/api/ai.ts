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
  async summarizeResource(token: string, resourceId: string, provider = "chatgpt") {
    return apiClient.post<AISummarizeResponse>(`/ai/summarize/${resourceId}?provider=${provider}`, {}, token)
  },
}
