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

export interface AdminPayoutResponse {
  success: boolean
  data: Array<{
    id: string
    user: {
      id: string
      first_name: string
      last_name: string
      email: string
      points: number
    }
    amount_naira: number
    amount_points: number
    status: "pending" | "approved" | "paid" | "declined"
    bank_account: AccountDetails
    created_at: string
  }>
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface PayoutStatsResponse {
  success: boolean
  data: {
    pending_count: number
    conversion_rate: number
    min_payout: number
    max_payout: number
    is_enabled: boolean
  }
}

export interface PayoutSettingsResponse {
  success: boolean
  message: string
  data: {
    points_to_naira_rate: number
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

export const adminPayoutService = {
  // Get all payouts
  async getAllPayouts(
    token: string,
    options?: {
      page?: number
      limit?: number
      status?: "pending" | "approved" | "paid" | "declined"
    },
  ) {
    const params = new URLSearchParams()
    if (options?.page) params.append("page", options.page.toString())
    if (options?.limit) params.append("limit", options.limit.toString())
    if (options?.status) params.append("status", options.status)

    const query = params.toString()
    const endpoint = query ? `/payout/admin/all?${query}` : "/payout/admin/all"

    return apiClient.get<AdminPayoutResponse>(endpoint, token)
  },

  // Approve payout
  async approvePayout(token: string, payoutId: string) {
    return apiClient.patch<PayoutRequestResponse>(`/payout/admin/${payoutId}/approve`, {}, token)
  },

  // Mark as paid
  async markAsPaid(token: string, payoutId: string) {
    return apiClient.patch<PayoutRequestResponse>(`/payout/admin/${payoutId}/paid`, {}, token)
  },

  // Decline payout
  async declinePayout(token: string, payoutId: string, reason: string) {
    return apiClient.patch<PayoutRequestResponse>(`/payout/admin/${payoutId}/decline`, { reason }, token)
  },

  // Get payout stats
  async getPayoutStats(token: string) {
    return apiClient.get<PayoutStatsResponse>("/payout/admin/stats", token)
  },

  // Get payout settings
  async getPayoutSettings(token: string) {
    return apiClient.get<PayoutSettingsResponse>("/payout/admin/settings", token)
  },

  // Update payout settings
  async updatePayoutSettings(
    token: string,
    settings: {
      points_to_naira_rate: number
      min_payout_points: number
      max_payout_points: number
      is_payout_enabled: boolean
    },
  ) {
    return apiClient.patch<PayoutSettingsResponse>("/payout/admin/settings", settings, token)
  },
}