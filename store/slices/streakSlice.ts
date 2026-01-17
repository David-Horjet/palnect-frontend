import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { streakService, type StreakData, type LearningActivity } from "@/services/api/streak"
import { toast } from "@/lib/toast"

interface StreakState {
  streak: StreakData | null
  activities: LearningActivity[]
  loading: boolean
  error: string | null
}

const initialState: StreakState = {
  streak: null,
  activities: [],
  loading: false,
  error: null,
}

export const fetchUserStreak = createAsyncThunk(
  "streak/fetchUserStreak",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found")

      const response = await streakService.getUserStreak(token)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch streak"
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const fetchUserActivitiesToday = createAsyncThunk(
  "streak/fetchUserActivitiesToday",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found")

      const response = await streakService.getUserActivitiesToday(token)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch activities"
      return rejectWithValue(message)
    }
  }
)

const streakSlice = createSlice({
  name: "streak",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateStreakLocally: (state, action: PayloadAction<Partial<StreakData>>) => {
      if (state.streak) {
        state.streak = { ...state.streak, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStreak.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserStreak.fulfilled, (state, action) => {
        state.loading = false
        state.streak = action.payload
      })
      .addCase(fetchUserStreak.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchUserActivitiesToday.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserActivitiesToday.fulfilled, (state, action) => {
        state.loading = false
        state.activities = action.payload
      })
      .addCase(fetchUserActivitiesToday.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, updateStreakLocally } = streakSlice.actions
export default streakSlice.reducer