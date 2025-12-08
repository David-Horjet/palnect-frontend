import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { adminPayoutService, payoutService, type AccountDetails, type PayoutRequest } from "@/services/api/payout"
import { toast } from "@/lib/toast"

interface PayoutState {
  accountDetails: AccountDetails | null
  payoutHistory: PayoutRequest[]
  conversionRate: number
  minPayoutPoints: number
  maxPayoutPoints: number
  isPayoutEnabled: boolean
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface AdminPayoutState extends PayoutState {
  adminPayouts: any[]
  payoutStats: {
    pending_count: number
    conversion_rate: number
    min_payout: number
    max_payout: number
    is_enabled: boolean
  } | null
  adminLoading: boolean
}

const initialState: AdminPayoutState = {
  accountDetails: null,
  payoutHistory: [],
  conversionRate: 0.01,
  minPayoutPoints: 1000,
  maxPayoutPoints: 100000,
  isPayoutEnabled: true,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  adminPayouts: [],
  payoutStats: null,
  adminLoading: false,
}

export const saveAccountDetails = createAsyncThunk(
  "payout/saveAccountDetails",
  async (
    {
      token,
      details,
    }: {
      token: string
      details: {
        bank_name: string
        account_number: string
        account_holder_name: string
      }
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await payoutService.saveAccountDetails(token, details)
      toast.success(response.message)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to save account details"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const getAccountDetails = createAsyncThunk(
  "payout/getAccountDetails",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const response = await payoutService.getAccountDetails(token)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch account details"
      return rejectWithValue(message)
    }
  },
)

export const requestPayout = createAsyncThunk(
  "payout/requestPayout",
  async (
    {
      token,
      amount_points,
      amount_naira,
    }: {
      token: string
      amount_points: number
      amount_naira: number
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await payoutService.requestPayout(token, {
        amount_points,
        amount_naira,
      })
      toast.success(response.message)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to request payout"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const fetchPayoutHistory = createAsyncThunk(
  "payout/fetchPayoutHistory",
  async ({ token, page, limit }: { token: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await payoutService.getPayoutHistory(token, { page, limit })
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch payout history"
      return rejectWithValue(message)
    }
  },
)

export const getConversionRate = createAsyncThunk(
  "payout/getConversionRate",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const response = await payoutService.getConversionRate(token)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch conversion rate"
      return rejectWithValue(message)
    }
  },
)

export const fetchAdminPayouts = createAsyncThunk(
  "payout/fetchAdminPayouts",
  async (
    {
      token,
      page,
      limit,
      status,
    }: {
      token: string
      page?: number
      limit?: number
      status?: "pending" | "approved" | "paid" | "declined"
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminPayoutService.getAllPayouts(token, { page, limit, status })
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch payouts"
      return rejectWithValue(message)
    }
  },
)

export const approvePayoutRequest = createAsyncThunk(
  "payout/approvePayoutRequest",
  async ({ token, payoutId }: { token: string; payoutId: string }, { rejectWithValue }) => {
    try {
      const response = await adminPayoutService.approvePayout(token, payoutId)
      toast.success(response.message)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to approve payout"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const markPayoutAsPaid = createAsyncThunk(
  "payout/markPayoutAsPaid",
  async ({ token, payoutId }: { token: string; payoutId: string }, { rejectWithValue }) => {
    try {
      const response = await adminPayoutService.markAsPaid(token, payoutId)
      toast.success(response.message)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to mark payout as paid"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const declinePayoutRequest = createAsyncThunk(
  "payout/declinePayoutRequest",
  async ({ token, payoutId, reason }: { token: string; payoutId: string; reason: string }, { rejectWithValue }) => {
    try {
      const response = await adminPayoutService.declinePayout(token, payoutId, reason)
      toast.success(response.message)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to decline payout"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const fetchPayoutStats = createAsyncThunk(
  "payout/fetchPayoutStats",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const response = await adminPayoutService.getPayoutStats(token)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message)
    }
  },
)

export const fetchPayoutSettings = createAsyncThunk(
  "payout/fetchPayoutSettings",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const response = await adminPayoutService.getPayoutSettings(token)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message)
    }
  },
)

export const updatePayoutSettings = createAsyncThunk(
  "payout/updatePayoutSettings",
  async (
    {
      token,
      settings,
    }: {
      token: string
      settings: {
        points_to_naira_rate: number
        min_payout_points: number
        max_payout_points: number
        is_payout_enabled: boolean
      }
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminPayoutService.updatePayoutSettings(token, settings)
      toast.success(response.message)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update settings"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

const payoutSlice = createSlice({
  name: "payout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Save Account Details
      .addCase(saveAccountDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(saveAccountDetails.fulfilled, (state, action) => {
        state.loading = false
        state.accountDetails = action.payload
      })
      .addCase(saveAccountDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Get Account Details
      .addCase(getAccountDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAccountDetails.fulfilled, (state, action) => {
        state.loading = false
        state.accountDetails = action.payload
      })
      .addCase(getAccountDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Request Payout
      .addCase(requestPayout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(requestPayout.fulfilled, (state, action) => {
        state.loading = false
        state.payoutHistory.unshift(action.payload)
      })
      .addCase(requestPayout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Payout History
      .addCase(fetchPayoutHistory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPayoutHistory.fulfilled, (state, action) => {
        state.loading = false
        state.payoutHistory = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchPayoutHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Get Conversion Rate
      .addCase(getConversionRate.fulfilled, (state, action) => {
        state.conversionRate = action.payload.rate
        state.minPayoutPoints = action.payload.min_payout_points
        state.maxPayoutPoints = action.payload.max_payout_points
        state.isPayoutEnabled = action.payload.is_payout_enabled
      })

      // Admin Payouts
      .addCase(fetchAdminPayouts.pending, (state) => {
        state.adminLoading = true
        state.error = null
      })
      .addCase(fetchAdminPayouts.fulfilled, (state, action) => {
        state.adminLoading = false
        state.adminPayouts = action.payload
      })
      .addCase(fetchAdminPayouts.rejected, (state, action) => {
        state.adminLoading = false
        state.error = action.payload as string
      })

      // Approve Payout Request
      .addCase(approvePayoutRequest.pending, (state) => {
        state.adminLoading = true
        state.error = null
      })
      .addCase(approvePayoutRequest.fulfilled, (state, action) => {
        state.adminLoading = false
        const index = state.adminPayouts.findIndex((payout) => payout.id === action.payload.id)
        if (index !== -1) {
          state.adminPayouts[index] = action.payload
        }
      })
      .addCase(approvePayoutRequest.rejected, (state, action) => {
        state.adminLoading = false
        state.error = action.payload as string
      })

      // Mark Payout As Paid
      .addCase(markPayoutAsPaid.pending, (state) => {
        state.adminLoading = true
        state.error = null
      })
      .addCase(markPayoutAsPaid.fulfilled, (state, action) => {
        state.adminLoading = false
        const index = state.adminPayouts.findIndex((payout) => payout.id === action.payload.id)
        if (index !== -1) {
          state.adminPayouts[index] = action.payload
        }
      })
      .addCase(markPayoutAsPaid.rejected, (state, action) => {
        state.adminLoading = false
        state.error = action.payload as string
      })

      // Decline Payout Request
      .addCase(declinePayoutRequest.pending, (state) => {
        state.adminLoading = true
        state.error = null
      })
      .addCase(declinePayoutRequest.fulfilled, (state, action) => {
        state.adminLoading = false
        const index = state.adminPayouts.findIndex((payout) => payout.id === action.payload.id)
        if (index !== -1) {
          state.adminPayouts[index] = action.payload
        }
      })
      .addCase(declinePayoutRequest.rejected, (state, action) => {
        state.adminLoading = false
        state.error = action.payload as string
      })

      // Fetch Payout Stats
      .addCase(fetchPayoutStats.fulfilled, (state, action) => {
        state.payoutStats = action.payload
      })

      // Fetch Payout Settings
      .addCase(fetchPayoutSettings.fulfilled, (state, action) => {
        state.conversionRate = action.payload.points_to_naira_rate
        state.minPayoutPoints = action.payload.min_payout_points
        state.maxPayoutPoints = action.payload.max_payout_points
        state.isPayoutEnabled = action.payload.is_payout_enabled
      })

      // Update Payout Settings
      .addCase(updatePayoutSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePayoutSettings.fulfilled, (state, action) => {
        state.loading = false
        state.conversionRate = action.payload.points_to_naira_rate
        state.minPayoutPoints = action.payload.min_payout_points
        state.maxPayoutPoints = action.payload.max_payout_points
        state.isPayoutEnabled = action.payload.is_payout_enabled
      })
      .addCase(updatePayoutSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default payoutSlice.reducer
