import { apiClient } from "@/lib/api"

export interface LiveTutorSession {
  id: string
  user_id: string
  started_at: string
  ended_at?: string
  duration?: number
  summary?: string
  key_concepts?: string[]
  flashcards_generated?: boolean
  quizzes_generated?: boolean
  references?: string[]
  created_at: string
  updated_at: string
}

export interface EphemeralTokenResponse {
  token: string
  expiresAt: number
  model: string
}

export interface StartSessionResponse {
  sessionId: string
}

export interface EndSessionRequest {
  summary?: string
  keyConcepts?: string[]
  flashcardsGenerated?: boolean
  quizzesGenerated?: boolean
  references?: string[]
}

export const liveTutorService = {
  /**
   * Generate ephemeral token for Gemini Live API
   */
  async generateToken(token: string): Promise<EphemeralTokenResponse> {
    return apiClient.post<EphemeralTokenResponse>('/live-tutor/token', {}, token)
  },

  /**
   * Start a new live tutor session
   */
  async startSession(token: string): Promise<StartSessionResponse> {
    return apiClient.post<StartSessionResponse>('/live-tutor/session/start', {}, token)
  },

  /**
   * End a live tutor session with artifacts
   */
  async endSession(sessionId: string, data: EndSessionRequest, token: string): Promise<{ sessionId: string }> {
    return apiClient.put<{ sessionId: string }>(`/live-tutor/session/${sessionId}/end`, data, token)
  },

  /**
   * Get user's live tutor sessions
   */
  async getSessions(token: string): Promise<{ sessions: LiveTutorSession[] }> {
    return apiClient.get<{ sessions: LiveTutorSession[] }>('/live-tutor/sessions', token)
  },

  /**
   * Get specific session details
   */
  async getSession(sessionId: string, token: string): Promise<{ session: LiveTutorSession }> {
    return apiClient.get<{ session: LiveTutorSession }>(`/live-tutor/session/${sessionId}`, token)
  },
}