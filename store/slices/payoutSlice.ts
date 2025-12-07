import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { payoutService, type AccountDetails, type PayoutRequest } from "@/services/api/payout"
import { toast } from "@/lib/toast"

interface PayoutState {
  accountDetails: AccountDetails | null
  payoutHistory: PayoutRequest[]
  conversionRate: number
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const initialState: PayoutState = {
  accountDetails: null,
  payoutHistory: [],
  conversionRate: 0.01,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
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
      return response.data.rate
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch conversion rate"
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
        state.conversionRate = action.payload
      })
  },
})

export default payoutSlice.reducer
