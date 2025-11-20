import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { pointsService } from "@/services/api/points"
import { toast } from "@/lib/toast"

interface Transaction {
  id: string
  user_id: string
  type: string
  amount: number
  description: string
  reference?: string
  status: string
  metadata?: any
  created_at: string
}

interface PointsState {
  balance: number
  transactions: Transaction[]
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  paymentUrl: string | null
  paymentReference: string | null
}

const initialState: PointsState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  paymentUrl: null,
  paymentReference: null,
}

export const fetchBalance = createAsyncThunk(
  "points/fetchBalance",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const response = await pointsService.getBalance(token)
      return response.data
    } catch (error: any) {
      const message = error?.message || "Failed to fetch balance"
      return rejectWithValue(message)
    }
  },
)

export const purchasePoints = createAsyncThunk(
  "points/purchasePoints",
  async ({ token, amount, email }: { token: string; amount: number; email: string }, { rejectWithValue }) => {
    try {
      const response = await pointsService.purchasePoints(token, amount, email)
      return response.data
    } catch (error: any) {
      const message = error?.message || "Failed to initialize payment"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const verifyPayment = createAsyncThunk(
  "points/verifyPayment",
  async ({ token, reference }: { token: string; reference: string }, { rejectWithValue }) => {
    try {
      const response = await pointsService.verifyPayment(token, reference)
      // toast.success("Payment verified successfully!")
      return response.data
    } catch (error: any) {
      const message = error?.message || "Failed to verify payment"
      // toast.error(message)
      return rejectWithValue(message) 
    }
  },
)

export const fetchTransactions = createAsyncThunk(
  "points/fetchTransactions",
  async ({ token, page, limit }: { token: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await pointsService.getTransactions(token, page, limit)
      return response
    } catch (error: any) {
      const message = error?.message || "Failed to fetch transactions"
      return rejectWithValue(message)
    }
  },
)

const pointsSlice = createSlice({
  name: "points",
  initialState,
  reducers: {
    clearPaymentUrl: (state) => {
      state.paymentUrl = null
      state.paymentReference = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balance = action.payload.points
      })
      .addCase(purchasePoints.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(purchasePoints.fulfilled, (state, action) => {
        state.loading = false
        state.paymentUrl = action.payload.authorizationUrl
        state.paymentReference = action.payload.reference
      })
      .addCase(purchasePoints.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false
        state.balance += action.payload.points
        state.paymentUrl = null
        state.paymentReference = null
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearPaymentUrl } = pointsSlice.actions
export default pointsSlice.reducer
