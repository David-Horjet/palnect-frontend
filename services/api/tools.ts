import { apiClient } from "@/lib/api"

export interface Flashcard {
  id: string
  front: string
  back: string
  created_at: string
}

export interface FlashcardDeck {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  flashcards: Flashcard[]
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false'
  options: string[] | null
  correct_answer: string
  created_at: string
}

export interface Quiz {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  quiz_questions: QuizQuestion[]
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id: string
  answers: any[]
  score: number
  total_questions: number
  completed_at: string
}

export interface QuizResult {
  score: number
  totalQuestions: number
  percentage: number
  attempt: QuizAttempt
}

export class ToolsService {
  static async generateFlashcards(token: string, data: { title: string; content?: string; cards?: Array<{ front: string; back: string }> }) {
    const response = await apiClient.post<{ data: FlashcardDeck }>('/tools/flash-cards/generate', data, token)
    return response.data
  }

  static async getFlashcardDecks(token: string) {
    const response = await apiClient.get<{ data: FlashcardDeck[] }>('/tools/flash-cards', token)
    return response.data
  }

  static async getFlashcardDeck(token: string, deckId: string) {
    const response = await apiClient.get<{ data: FlashcardDeck }>(`/tools/flash-cards/${deckId}`, token)
    return response.data
  }

  static async deleteFlashcardDeck(token: string, deckId: string) {
    await apiClient.delete(`/tools/flash-cards/${deckId}`, token)
    return true
  }

  static async generateQuiz(token: string, data: { title: string; content?: string; questions?: Array<{ question: string; type: 'multiple_choice' | 'true_false'; options?: string[]; correctAnswer: number | boolean }> }) {
    const response = await apiClient.post<{ data: Quiz }>('/tools/quizzes/generate', data, token)
    return response.data
  }

  static async getQuizzes(token: string) {
    const response = await apiClient.get<{ data: Quiz[] }>('/tools/quizzes', token)
    return response.data
  }

  static async getQuiz(token: string, quizId: string) {
    const response = await apiClient.get<{ data: Quiz }>(`/tools/quizzes/${quizId}`, token)
    return response.data
  }

  static async submitQuiz(token: string, quizId: string, answers: (number | boolean | null)[]) {
    const response = await apiClient.post<{ data: QuizResult }>(`/tools/quizzes/${quizId}/submit`, { answers }, token)
    return response.data
  }

  static async deleteQuiz(token: string, quizId: string) {
    await apiClient.delete(`/tools/quizzes/${quizId}`, token)
    return true
  }
}