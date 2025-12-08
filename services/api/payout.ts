import { apiClient } from "@/lib/api"

export interface AccountDetails {
  id: string
  user_id: string
  bank_name: string
  account_number: string
  account_holder_name: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface PayoutRequest {
  id: string
  user_id: string
  amount_naira: number
  amount_points: number
  status: "pending" | "approved" | "paid" | "declined"
  bank_account_id: string
  decline_reason?: string
  created_at: string
  updated_at: string
}

export interface AccountDetailsResponse {
  success: boolean
  message: string
  data: AccountDetails
}

export interface PayoutHistoryResponse {
  success: boolean
  message: string
  data: PayoutRequest[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface PayoutRequestResponse {
  success: boolean
  message: string
  data: PayoutRequest
}

export interface ConversionRateResponse {
  success: boolean
  message: string
  data: {
    rate: number
    min_payout_points: number
    max_payout_points: number
    is_payout_enabled: boolean
  }
}

export const payoutService = {
  // Save or update account details
  async saveAccountDetails(
    token: string,
    details: {
      bank_name: string
      account_number: string
      account_holder_name: string
    },
  ) {
    return apiClient.post<AccountDetailsResponse>("/payout/account-details", details, token)
  },

  // Get saved account details
  async getAccountDetails(token: string) {
    return apiClient.get<AccountDetailsResponse>("/payout/account-details", token)
  },

  // Request payout
  async requestPayout(
    token: string,
    data: {
      amount_points: number
      amount_naira: number
    },
  ) {
    return apiClient.post<PayoutRequestResponse>("/payout/request", data, token)
  },

  // Get payout history
  async getPayoutHistory(
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
    const endpoint = query ? `/payout/history?${query}` : "/payout/history"

    return apiClient.get<PayoutHistoryResponse>(endpoint, token)
  },

  // Get conversion rate (points to naira)
  async getConversionRate(token: string) {
    return apiClient.get<ConversionRateResponse>("/payout/conversion-rate", token)
  },
}
