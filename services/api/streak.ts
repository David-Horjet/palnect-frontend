import { apiClient } from "@/lib/api"

export interface StreakData {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  created_at: string
  updated_at: string
}

export interface LearningActivity {
  id: string
  user_id: string
  activity_type: string
  activity_id: string | null
  points_earned: number
  created_at: string
}

export interface StreakResponse {
  success: boolean
  message: string
  data: StreakData
}

export interface ActivitiesResponse {
  success: boolean
  message: string
  data: LearningActivity[]
}

export const streakService = {
  async getUserStreak(token: string): Promise<StreakResponse> {
    return apiClient.get<StreakResponse>("/streaks", token)
  },

  async getUserActivitiesToday(token: string): Promise<ActivitiesResponse> {
    return apiClient.get<ActivitiesResponse>("/streaks/activities/today", token)
  },

  async getUserActivitiesInDateRange(
    token: string,
    startDate: string,
    endDate: string
  ): Promise<ActivitiesResponse> {
    return apiClient.get<ActivitiesResponse>(
      `/streaks/activities/range?startDate=${startDate}&endDate=${endDate}`,
      token
    )
  },
}