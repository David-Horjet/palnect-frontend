import { apiClient } from "@/lib/api"

export interface PointsBalance {
  id: string
  user_id: string
  balance: number
  total_earned: number
  total_spent: number
  updated_at: string
}

export interface PointsBalanceResponse {
  success: boolean
  message: string
  data: PointsBalance
}

export interface PaymentInitiation {
  authorization_url: string
  access_code: string
  reference: string
}

export interface PurchasePointsResponse {
  success: boolean
  message: string
  data: PaymentInitiation
}

export interface Transaction {
  id: string
  user_id: string
  type: "purchase" | "subscription_payment" | "earning" | "refund"
  amount: number
  description: string
  reference?: string
  status: "completed" | "pending" | "failed"
  created_at: string
}

export interface TransactionHistoryResponse {
  success: boolean
  message: string
  data: Transaction[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface VerifyPaymentResponse {
  success: boolean
  message: string
  data: {
    verified: boolean
    transaction: Transaction
  }
}

export const pointsService = {
  // Get user's current points balance
  async getBalance(token: string) {
    return apiClient.get<PointsBalanceResponse>("/points/balance", token)
  },

  // Purchase points (initiate payment)
  async purchasePoints(token: string, amount: number, email: string) {
    return apiClient.post<PurchasePointsResponse>(
      "/points/purchase",
      {
        amount,
        email,
      },
      token,
    )
  },

  // Verify payment and credit points
  async verifyPayment(token: string, reference: string) {
    return apiClient.get<VerifyPaymentResponse>(`/points/verify?reference=${reference}`, token)
  },

  // Get transaction history
  async getTransactions(
    token: string,
    options?: {
      page?: number
      limit?: number
    },
  ) {
    const params = new URLSearchParams()
    if (options?.page) params.append("page", options.page.toString())
    if (options?.limit) params.append("limit", options.limit.toString())

    const query = params.toString()
    const endpoint = query ? `/points/transactions?${query}` : "/points/transactions"

    return apiClient.get<TransactionHistoryResponse>(endpoint, token)
  },
}
