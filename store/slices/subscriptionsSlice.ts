import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { subscriptionsService } from "@/services/api/subscriptions"
import { toast } from "@/lib/toast"

interface Subscription {
  id: string
  duration: string
  points_cost: number
  start_date: string
  end_date: string
  status: string
  mentor?: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
    school?: string
  }
  mentor_profile?: {
    expertise: string[]
  }
  student?: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
    school?: string
    email?: string
  }
  created_at: string
}

interface SubscriptionsState {
  studentSubscriptions: Subscription[]
  mentorSubscriptions: Subscription[]
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const initialState: SubscriptionsState = {
  studentSubscriptions: [],
  mentorSubscriptions: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
}

export const subscribe = createAsyncThunk(
  "subscriptions/subscribe",
  async (
    { token, mentorProfileId, duration }: { token: string; mentorProfileId: string; duration: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await subscriptionsService.subscribe(token, mentorProfileId, duration as any)
      toast.success("Subscribed successfully!")
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to subscribe"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const fetchStudentSubscriptions = createAsyncThunk(
  "subscriptions/fetchStudentSubscriptions",
  async ({ token, page, limit }: { token: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await subscriptionsService.getStudentSubscriptions(token, page, limit)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch subscriptions"
      return rejectWithValue(message)
    }
  },
)

export const fetchMentorSubscriptions = createAsyncThunk(
  "subscriptions/fetchMentorSubscriptions",
  async ({ token, page, limit }: { token: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await subscriptionsService.getMentorSubscriptions(token, page, limit)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch subscriptions"
      return rejectWithValue(message)
    }
  },
)

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(subscribe.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(subscribe.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(subscribe.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchStudentSubscriptions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudentSubscriptions.fulfilled, (state, action) => {
        state.loading = false
        state.studentSubscriptions = action.payload.data as any
        state.pagination = action.payload.pagination
      })
      .addCase(fetchStudentSubscriptions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchMentorSubscriptions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMentorSubscriptions.fulfilled, (state, action) => {
        state.loading = false
        state.mentorSubscriptions = action.payload.data as any
        state.pagination = action.payload.pagination
      })
      .addCase(fetchMentorSubscriptions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default subscriptionsSlice.reducer
