import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { mentorsService, type Mentor } from "@/services/api/mentors"
import { showToast } from "@/lib/toast"

interface MentorState {
  mentors: Mentor[]
  selectedMentor: Mentor | null
  loading: boolean
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  error: string | null
}

const initialState: MentorState = {
  mentors: [],
  selectedMentor: null,
  loading: false,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  error: null,
}

export const applyMentor = createAsyncThunk(
  "mentors/apply",
  async (
    {
      token,
      data,
    }: {
      token: string
      data: {
        expertise: string[]
        bio: string
        dailyRate: number
        weeklyRate: number
        monthlyRate: number
        availability: { weekdays: string[]; hours: string }
      }
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await mentorsService.apply(token, data)
      showToast("success", "Mentor application submitted successfully!")
      return response.data
    } catch (error: any) {
      const message = error?.message || "Failed to submit mentor application"
      showToast("error", message)
      return rejectWithValue(message)
    }
  },
)

export const fetchMentors = createAsyncThunk(
  "mentors/fetchList",
  async (
    {
      token,
      page = 1,
      limit = 20,
      expertise,
      search,
    }: {
      token: string
      page?: number
      limit?: number
      expertise?: string
      search?: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await mentorsService.list(token, { page, limit, expertise, search })
      return response
    } catch (error: any) {
      const message = error?.message || "Failed to fetch mentors"
      showToast("error", message)
      return rejectWithValue(message)
    }
  },
)

export const fetchMentorDetail = createAsyncThunk(
  "mentors/fetchDetail",
  async ({ token, id }: { token: string; id: string }, { rejectWithValue }) => {
    try {
      const response = await mentorsService.getDetail(token, id)
      return response.data
    } catch (error: any) {
      const message = error?.message || "Failed to fetch mentor details"
      showToast("error", message)
      return rejectWithValue(message)
    }
  },
)

export const updateMentorProfile = createAsyncThunk(
  "mentors/updateProfile",
  async (
    {
      token,
      data,
    }: {
      token: string
      data: {
        expertise: string[]
        bio: string
        dailyRate: number
        weeklyRate: number
        monthlyRate: number
        availability: { weekdays: string[]; hours: string }
      }
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await mentorsService.updateProfile(token, data)
      showToast("success", "Mentor profile updated successfully!")
      return response.data.data
    } catch (error: any) {
      const message = error?.message || "Failed to update mentor profile"
      showToast("error", message)
      return rejectWithValue(message)
    }
  },
)

const mentorsSlice = createSlice({
  name: "mentors",
  initialState,
  reducers: {
    clearSelectedMentor: (state) => {
      state.selectedMentor = null
    },
  },
  extraReducers: (builder) => {
    // Apply Mentor
    builder.addCase(applyMentor.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(applyMentor.fulfilled, (state, action) => {
      state.loading = false
      state.selectedMentor = action.payload
    })
    builder.addCase(applyMentor.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch Mentors
    builder.addCase(fetchMentors.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchMentors.fulfilled, (state, action: any) => {
      state.loading = false
      state.mentors = action.payload.data || []
      state.pagination = action.payload.pagination
    })
    builder.addCase(fetchMentors.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch Mentor Detail
    builder.addCase(fetchMentorDetail.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchMentorDetail.fulfilled, (state, action) => {
      state.loading = false
      state.selectedMentor = action.payload
    })
    builder.addCase(fetchMentorDetail.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Update Mentor Profile
    builder.addCase(updateMentorProfile.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateMentorProfile.fulfilled, (state, action) => {
      state.loading = false
      state.selectedMentor = action.payload
    })
    builder.addCase(updateMentorProfile.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const { clearSelectedMentor } = mentorsSlice.actions
export default mentorsSlice.reducer
