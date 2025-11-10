import { apiClient } from "@/lib/api"

export interface Mentor {
  id: string
  first_name: string
  last_name: string
  avatar_url?: string
  expertise: string[]
}

export interface Subscription {
  id: string
  student_id: string
  mentor_id: string
  duration: "daily" | "weekly" | "monthly"
  start_date: string
  end_date: string
  status: "active" | "expired" | "cancelled"
  mentor: Mentor
  created_at: string
}

export interface StudentSubscriptionsResponse {
  success: boolean
  message: string
  data: Subscription[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface MentorSubscriptionsResponse {
  success: boolean
  message: string
  data: Subscription[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface SubscribeResponse {
  success: boolean
  message: string
  data: Subscription
}

export const subscriptionsService = {
  // Subscribe to a mentor
  async subscribe(token: string, mentorProfileId: string, duration: "daily" | "weekly" | "monthly") {
    return apiClient.post<SubscribeResponse>(
      "/subscriptions/subscribe",
      {
        mentorProfileId,
        duration,
      },
      token,
    )
  },

  // Get student's subscriptions
  async getStudentSubscriptions(
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
    const endpoint = query ? `/subscriptions/student?${query}` : "/subscriptions/student"

    return apiClient.get<StudentSubscriptionsResponse>(endpoint, token)
  },

  // Get mentor's subscriptions (earnings)
  async getMentorSubscriptions(
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
    const endpoint = query ? `/subscriptions/mentor?${query}` : "/subscriptions/mentor"

    return apiClient.get<MentorSubscriptionsResponse>(endpoint, token)
  },
}
