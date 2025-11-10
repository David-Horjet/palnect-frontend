import { apiClient } from "@/lib/api"

export interface Availability {
  weekdays: string[]
  hours: string
}

export interface Mentor {
  data: any
  id: string
  user_id: string
  expertise: string[]
  bio: string
  daily_rate: number
  weekly_rate: number
  monthly_rate: number
  availability: Availability
  is_approved: boolean
  total_students: number
  rating?: number
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    avatar_url: string
    school: string
    department?: string
  }
  created_at: string
}

export interface MentorApplication {
  expertise: string[]
  bio: string
  dailyRate: number
  weeklyRate: number
  monthlyRate: number
  availability: Availability
}

export interface MentorsListResponse {
  success: boolean
  message: string
  data: Mentor[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface MentorDetailResponse {
  success: boolean
  message: string
  data: Mentor
}

export interface MentorApplicationResponse {
  success: boolean
  message: string
  data: Mentor
}

export const mentorsService = {
  async apply(token: string, data: MentorApplication) {
    return apiClient.post<MentorApplicationResponse>("/mentors/apply", data, token)
  },

  async list(
    token: string,
    options?: {
      page?: number
      limit?: number
      expertise?: string
      search?: string
    },
  ) {
    const params = new URLSearchParams()
    if (options?.page) params.append("page", options.page.toString())
    if (options?.limit) params.append("limit", options.limit.toString())
    if (options?.expertise) params.append("expertise", options.expertise)
    if (options?.search) params.append("search", options.search)

    const query = params.toString()
    const url = query ? `/mentors?${query}` : "/mentors"
    return apiClient.get<MentorsListResponse>(url, token)
  },

  async getDetail(token: string, id: string) {
    return apiClient.get<MentorDetailResponse>(`/mentors/${id}`, token)
  },

  async updateProfile(token: string, data: MentorApplication) {
    return apiClient.put<MentorDetailResponse>("/mentors/profile", data, token)
  },
}
