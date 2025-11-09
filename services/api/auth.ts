import { apiClient } from "@/lib/api"

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  username?: string
  school?: string
  department?: string
  year_of_study?: string
  avatar_url?: string
  bio?: string
  points: number
  is_verified: boolean
  is_mentor?: boolean
  is_admin?: boolean
  created_at: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: User
}

export const authService = {
  async signup(email: string, password: string, firstName: string, lastName: string) {
    return apiClient.post<AuthResponse>("/auth/signup", {
      email,
      password,
      firstName,
      lastName,
    })
  },

  async login(email: string, password: string) {
    return apiClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    })
  },

  async getProfile(token: string) {
    return apiClient.get<ProfileResponse>("/auth/profile", token)
  },

  async updateProfile(
    token: string,
    data: {
      firstName?: string
      lastName?: string
      username?: string
      school?: string
      department?: string
      yearOfStudy?: string
      bio?: string
    },
  ) {
    return apiClient.put<ProfileResponse>("/auth/profile", data, token)
  },

  async uploadAvatar(token: string, file: File) {
    const formData = new FormData()
    formData.append("avatar", file)
    return apiClient.postFormData<ProfileResponse>("/auth/avatar", formData, token)
  },

  async changePassword(token: string, currentPassword: string, newPassword: string) {
    return apiClient.put<{ success: boolean; message: string; data: { message: string } }>(
      "/auth/change-password",
      {
        currentPassword,
        newPassword,
      },
      token,
    )
  },

  async verifyEmail(token: string) {
    return apiClient.get<{ success: boolean; message: string; data: { message: string } }>(
      `/auth/verify-email?token=${token}`,
    )
  },

  async resendVerification(email: string) {
    return apiClient.post<{ success: boolean; message: string; data: { message: string } }>(
      "/auth/resend-verification",
      { email },
    )
  },

  async forgotPassword(email: string) {
    return apiClient.post<{ success: boolean; message: string; data: { message: string } }>("/auth/forgot-password", {
      email,
    })
  },

  async resetPassword(token: string, newPassword: string) {
    return apiClient.post<{ success: boolean; message: string; data: { message: string } }>("/auth/reset-password", {
      token,
      newPassword,
    })
  },
}
