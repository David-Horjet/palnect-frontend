import { apiClient } from "@/lib/api"

export interface AdminStats {
  totalUsers: number
  totalResources: number
  totalMentors: number
  activeSubscriptions: number
  totalTransactions: number
}

export interface PendingMentor {
  id: string
  user_id: string
  expertise: string[]
  bio: string
  daily_rate: number
  is_approved: boolean
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    school: string
    department: string
  }
  created_at: string
}

export interface AdminStatsResponse {
  success: boolean
  message: string
  data: AdminStats
}

export interface PendingMentorsResponse {
  success: boolean
  message: string
  data: PendingMentor[]
}

export interface ApproveMentorResponse {
  success: boolean
  message: string
  data: PendingMentor
}

export interface CreditPointsResponse {
  success: boolean
  message: string
  data: {
    id: string
    user_id: string
    type: string
    amount: number
    description: string
    status: string
    created_at: string
  }
}

export const adminService = {
  async getStats(token: string) {
    return apiClient.get<AdminStatsResponse>("/admin/stats", token)
  },

  async getPendingMentors(token: string) {
    return apiClient.get<PendingMentorsResponse>("/admin/pending-mentors", token)
  },

  async approveMentor(token: string, mentorId: string, approved: boolean) {
    return apiClient.post<ApproveMentorResponse>(`/admin/approve-mentor/${mentorId}`, { approved }, token)
  },

  async creditPoints(token: string, userId: string, amount: number, description: string) {
    return apiClient.post<CreditPointsResponse>("/admin/credit-points", { userId, amount, description }, token)
  },

  async debitPoints(token: string, userId: string, amount: number, description: string) {
    return apiClient.post<CreditPointsResponse>("/admin/debit-points", { userId, amount, description }, token)
  },
}
