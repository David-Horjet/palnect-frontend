import { apiClient } from "@/lib/api"

export const subscriptionsService = {
  subscribe: async (token: string, mentorProfileId: string, duration: "daily" | "weekly" | "monthly") => {
    const response = await apiClient.post(
      "/subscriptions/subscribe",
      {
        mentorProfileId,
        duration,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  },

  getStudentSubscriptions: async (token: string, page = 1, limit = 20) => {
    const response = await apiClient.get("/subscriptions/student", {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  getMentorSubscriptions: async (token: string, page = 1, limit = 20) => {
    const response = await apiClient.get("/subscriptions/mentor", {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },
}
