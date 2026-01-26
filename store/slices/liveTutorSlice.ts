import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { liveTutorService, type LiveTutorSession, type EphemeralTokenResponse } from "@/services/api/liveTutor"
import { generateFlashcards, generateQuiz } from "@/store/slices/toolsSlice"
import { toast } from "@/lib/toast"

interface LiveTutorState {
  sessions: LiveTutorSession[]
  currentSession: LiveTutorSession | null
  ephemeralToken: EphemeralTokenResponse | null
  loading: boolean
  error: string | null
  isConnected: boolean
  isMuted: boolean
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
  captions: string[]
  lastCaption: string
}

const initialState: LiveTutorState = {
  sessions: [],
  currentSession: null,
  ephemeralToken: null,
  loading: false,
  error: null,
  isConnected: false,
  isMuted: false,
  connectionStatus: 'disconnected',
  captions: [],
  lastCaption: '',
}

export const generateEphemeralToken = createAsyncThunk(
  "liveTutor/generateEphemeralToken",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await liveTutorService.generateToken(token)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to generate ephemeral token"
      return rejectWithValue(message)
    }
  }
)

export const startLiveSession = createAsyncThunk(
  "liveTutor/startLiveSession",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await liveTutorService.startSession(token)
      return response.data.sessionId
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to start live session"
      return rejectWithValue(message)
    }
  }
)

export const endLiveSession = createAsyncThunk(
  "liveTutor/endLiveSession",
  async ({ sessionId, data, token }: { sessionId: string; data: any; token: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await liveTutorService.endSession(sessionId, data, token)

      // Generate flashcards from session content
      if (data.keyConcepts && data.keyConcepts.length > 0) {
        const flashcardContent = `Key concepts from live tutoring session: ${data.keyConcepts.join(', ')}\n\nSummary: ${data.summary || ''}`
        dispatch(generateFlashcards({
          token,
          data: {
            title: `Live Session: ${new Date().toLocaleDateString()}`,
            content: flashcardContent
          }
        }))

        // Generate quiz from session content
        dispatch(generateQuiz({
          token,
          data: {
            title: `Live Session Quiz: ${new Date().toLocaleDateString()}`,
            content: flashcardContent
          }
        }))
      }

      return response
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to end live session"
      return rejectWithValue(message)
    }
  }
)

export const fetchLiveSessions = createAsyncThunk(
  "liveTutor/fetchLiveSessions",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await liveTutorService.getSessions(token)
      return response.sessions
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch live sessions"
      return rejectWithValue(message)
    }
  }
)

const liveTutorSlice = createSlice({
  name: "liveTutor",
  initialState,
  reducers: {
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload
      state.isConnected = action.payload === 'connected'
    },
    setMuted: (state, action) => {
      state.isMuted = action.payload
    },
    addCaption: (state, action) => {
      const caption = action.payload
      state.captions.push(caption)
      state.lastCaption = caption
      // Keep only last 10 captions
      if (state.captions.length > 10) {
        state.captions = state.captions.slice(-10)
      }
    },
    clearCaptions: (state) => {
      state.captions = []
      state.lastCaption = ''
    },
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload
    },
    clearCurrentSession: (state) => {
      state.currentSession = null
      state.ephemeralToken = null
      state.isConnected = false
      state.connectionStatus = 'disconnected'
      state.isMuted = false
      state.captions = []
      state.lastCaption = ''
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateEphemeralToken.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(generateEphemeralToken.fulfilled, (state, action) => {
        state.loading = false
        state.ephemeralToken = action.payload
      })
      .addCase(generateEphemeralToken.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        toast.error("Failed to generate connection token")
      })
      .addCase(startLiveSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(startLiveSession.fulfilled, (state, action) => {
        state.loading = false
        state.currentSession = action.payload
      })
      .addCase(startLiveSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        toast.error("Failed to start live session")
      })
      .addCase(endLiveSession.pending, (state) => {
        state.loading = true
      })
      .addCase(endLiveSession.fulfilled, (state) => {
        state.loading = false
        state.currentSession = null
        state.ephemeralToken = null
        state.isConnected = false
        state.connectionStatus = 'disconnected'
        toast.success("Session ended successfully")
      })
      .addCase(endLiveSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        toast.error("Failed to end session")
      })
      .addCase(fetchLiveSessions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLiveSessions.fulfilled, (state, action) => {
        state.loading = false
        state.sessions = action.payload
      })
      .addCase(fetchLiveSessions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const {
  setConnectionStatus,
  setMuted,
  addCaption,
  clearCaptions,
  setCurrentSession,
  clearCurrentSession,
  clearError,
} = liveTutorSlice.actions

export default liveTutorSlice.reducer