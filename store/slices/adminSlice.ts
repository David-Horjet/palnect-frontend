import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { adminService, type AdminStats, type PendingMentor } from "@/services/api/admin"
import { toast } from "@/lib/toast"

interface AdminState {
  stats: AdminStats | null
  pendingMentors: PendingMentor[]
  loading: boolean
  error: string | null
}

const initialState: AdminState = {
  stats: null,
  pendingMentors: [],
  loading: false,
  error: null,
}

export const getAdminStats = createAsyncThunk("admin/getStats", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("admin_token")
    if (!token) return rejectWithValue("No admin token found")

    const response = await adminService.getStats(token)
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch stats"
    toast.error(message)
    return rejectWithValue(message)
  }
})

export const getPendingMentors = createAsyncThunk("admin/getPendingMentors", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("admin_token")
    if (!token) return rejectWithValue("No admin token found")

    const response = await adminService.getPendingMentors(token)
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch pending mentors"
    toast.error(message)
    return rejectWithValue(message)
  }
})

export const approveMentor = createAsyncThunk(
  "admin/approveMentor",
  async (
    data: {
      mentorId: string
      approved: boolean
    },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem("admin_token")
      if (!token) return rejectWithValue("No admin token found")

      const response = await adminService.approveMentor(token, data.mentorId, data.approved)
      toast.success(data.approved ? "Mentor approved successfully" : "Mentor rejected successfully")
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update mentor status"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const creditPoints = createAsyncThunk(
  "admin/creditPoints",
  async (
    data: {
      userId: string
      amount: number
      description: string
    },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem("admin_token")
      if (!token) return rejectWithValue("No admin token found")

      const response = await adminService.creditPoints(token, data.userId, data.amount, data.description)
      toast.success("Points credited successfully")
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to credit points"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const debitPoints = createAsyncThunk(
  "admin/debitPoints",
  async (
    data: {
      userId: string
      amount: number
      description: string
    },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem("admin_token")
      if (!token) return rejectWithValue("No admin token found")

      const response = await adminService.debitPoints(token, data.userId, data.amount, data.description)
      toast.success("Points debited successfully")
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to debit points"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Stats
    builder.addCase(getAdminStats.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getAdminStats.fulfilled, (state, action) => {
      state.loading = false
      state.stats = action.payload
    })
    builder.addCase(getAdminStats.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Get Pending Mentors
    builder.addCase(getPendingMentors.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getPendingMentors.fulfilled, (state, action) => {
      state.loading = false
      state.pendingMentors = action.payload
    })
    builder.addCase(getPendingMentors.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Approve Mentor
    builder.addCase(approveMentor.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(approveMentor.fulfilled, (state, action) => {
      state.loading = false
      state.pendingMentors = state.pendingMentors.filter((mentor) => mentor.id !== action.payload.id)
    })
    builder.addCase(approveMentor.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Credit Points
    builder.addCase(creditPoints.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(creditPoints.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(creditPoints.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Debit Points
    builder.addCase(debitPoints.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(debitPoints.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(debitPoints.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export default adminSlice.reducer
