import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { ToolsService, type FlashcardDeck, type Quiz, type QuizResult } from "@/services/api/tools"
import { toast } from "@/lib/toast"

interface ToolsState {
  flashcardDecks: FlashcardDeck[]
  currentDeck: FlashcardDeck | null
  quizzes: Quiz[]
  currentQuiz: Quiz | null
  quizResult: QuizResult | null
  loading: boolean
  error: string | null
}

const initialState: ToolsState = {
  flashcardDecks: [],
  currentDeck: null,
  quizzes: [],
  currentQuiz: null,
  quizResult: null,
  loading: false,
  error: null,
}

export const generateFlashcards = createAsyncThunk(
  "tools/generateFlashcards",
  async ({ token, data }: { token: string; data: { title: string; content?: string; cards?: Array<{ front: string; back: string }> } }, { rejectWithValue }) => {
    try {
      const response = await ToolsService.generateFlashcards(token, data)
      toast.success("Flashcard deck created successfully")
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to generate flashcards"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const fetchFlashcardDecks = createAsyncThunk(
  "tools/fetchFlashcardDecks",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await ToolsService.getFlashcardDecks(token)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch flashcard decks"
      return rejectWithValue(message)
    }
  },
)

export const fetchFlashcardDeck = createAsyncThunk(
  "tools/fetchFlashcardDeck",
  async ({ token, deckId }: { token: string; deckId: string }, { rejectWithValue }) => {
    try {
      const response = await ToolsService.getFlashcardDeck(token, deckId)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch flashcard deck"
      return rejectWithValue(message)
    }
  },
)

export const deleteFlashcardDeck = createAsyncThunk(
  "tools/deleteFlashcardDeck",
  async ({ token, deckId }: { token: string; deckId: string }, { rejectWithValue }) => {
    try {
      await ToolsService.deleteFlashcardDeck(token, deckId)
      toast.success("Flashcard deck deleted successfully")
      return deckId
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete flashcard deck"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const generateQuiz = createAsyncThunk(
  "tools/generateQuiz",
  async ({ token, data }: { token: string; data: { title: string; content?: string; questions?: Array<{ question: string; type: 'multiple_choice' | 'true_false'; options?: string[]; correctAnswer: number | boolean }> } }, { rejectWithValue }) => {
    try {
      const response = await ToolsService.generateQuiz(token, data)
      toast.success("Quiz created successfully")
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to generate quiz"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const fetchQuizzes = createAsyncThunk(
  "tools/fetchQuizzes",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await ToolsService.getQuizzes(token)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch quizzes"
      return rejectWithValue(message)
    }
  },
)

export const fetchQuiz = createAsyncThunk(
  "tools/fetchQuiz",
  async ({ token, quizId }: { token: string; quizId: string }, { rejectWithValue }) => {
    try {
      const response = await ToolsService.getQuiz(token, quizId)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch quiz"
      return rejectWithValue(message)
    }
  },
)

export const submitQuiz = createAsyncThunk(
  "tools/submitQuiz",
  async ({ token, quizId, answers }: { token: string; quizId: string; answers: (number | boolean | null)[] }, { rejectWithValue }) => {
    try {
      const response = await ToolsService.submitQuiz(token, quizId, answers)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to submit quiz"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const deleteQuiz = createAsyncThunk(
  "tools/deleteQuiz",
  async ({ token, quizId }: { token: string; quizId: string }, { rejectWithValue }) => {
    try {
      await ToolsService.deleteQuiz(token, quizId)
      toast.success("Quiz deleted successfully")
      return quizId
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete quiz"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

const toolsSlice = createSlice({
  name: "tools",
  initialState,
  reducers: {
    clearCurrentDeck: (state) => {
      state.currentDeck = null
    },
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null
      state.quizResult = null
    },
    clearQuizResult: (state) => {
      state.quizResult = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateFlashcards.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(generateFlashcards.fulfilled, (state, action) => {
        state.loading = false
        state.flashcardDecks.unshift(action.payload)
      })
      .addCase(generateFlashcards.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(fetchFlashcardDecks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFlashcardDecks.fulfilled, (state, action) => {
        state.loading = false
        state.flashcardDecks = action.payload
      })
      .addCase(fetchFlashcardDecks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(fetchFlashcardDeck.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFlashcardDeck.fulfilled, (state, action) => {
        state.loading = false
        state.currentDeck = action.payload
      })
      .addCase(fetchFlashcardDeck.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(deleteFlashcardDeck.fulfilled, (state, action) => {
        state.flashcardDecks = state.flashcardDecks.filter((deck) => deck.id !== action.payload)
        if (state.currentDeck?.id === action.payload) {
          state.currentDeck = null
        }
      })

      .addCase(generateQuiz.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(generateQuiz.fulfilled, (state, action) => {
        state.loading = false
        state.quizzes.unshift(action.payload)
      })
      .addCase(generateQuiz.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false
        state.quizzes = action.payload
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(fetchQuiz.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.loading = false
        state.currentQuiz = action.payload
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(submitQuiz.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false
        state.quizResult = action.payload
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter((quiz) => quiz.id !== action.payload)
        if (state.currentQuiz?.id === action.payload) {
          state.currentQuiz = null
          state.quizResult = null
        }
      })
  },
})

export const { clearCurrentDeck, clearCurrentQuiz, clearQuizResult } = toolsSlice.actions
export default toolsSlice.reducer