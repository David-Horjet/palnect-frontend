import { apiClient } from "@/lib/api"

export interface Uploader {
  id: string
  first_name: string
  last_name: string
  avatar_url?: string
  school?: string
  department?: string
}

export interface Resource {
  id: string
  title: string
  description: string
  file_url: string
  file_name?: string
  file_size?: number
  file_type?: string
  category: "Past Questions" | "Lecture Notes" | "Assignments" | "Study Guides"
  department: string
  subject: string
  year: string
  school: string
  downloads: number
  ai_summary?: string
  summary_generated?: boolean
  uploader: Uploader
  created_at: string
}

export interface UploadResourceResponse {
  success: boolean
  message: string
  data: Resource
}

export interface ListResourcesResponse {
  success: boolean
  message: string
  data: Resource[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface SingleResourceResponse {
  success: boolean
  message: string
  data: Resource
}

export const resourcesService = {
  // Upload a resource (protected)
  async uploadResource(
    token: string,
    file: File,
    data: {
      title: string
      description: string
      category: string
      subject: string
      year: string
      school: string
      department: string
    },
  ) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", data.title)
    formData.append("description", data.description)
    formData.append("category", data.category)
    formData.append("subject", data.subject)
    formData.append("year", data.year)
    formData.append("school", data.school)
    formData.append("department", data.department)

    return apiClient.postFormData<UploadResourceResponse>("/resources/upload", formData, token)
  },

  // List all resources with filters
  async listResources(filters?: {
    page?: number
    limit?: number
    category?: string
    subject?: string
    school?: string
    year?: string
    search?: string
  }) {
    const params = new URLSearchParams()
    if (filters?.page) params.append("page", filters.page.toString())
    if (filters?.limit) params.append("limit", filters.limit.toString())
    if (filters?.category) params.append("category", filters.category)
    if (filters?.subject) params.append("subject", filters.subject)
    if (filters?.school) params.append("school", filters.school)
    if (filters?.year) params.append("year", filters.year)
    if (filters?.search) params.append("search", filters.search)

    const query = params.toString()
    const endpoint = query ? `/resources?${query}` : "/resources"

    return apiClient.get<ListResourcesResponse>(endpoint)
  },

  // Get single resource by ID
  async getResource(id: string) {
    return apiClient.get<SingleResourceResponse>(`/resources/${id}`)
  },

  // Get user's uploaded resources (protected)
  async getUserResources(
    token: string,
    filters?: {
      page?: number
      limit?: number
    },
  ) {
    const params = new URLSearchParams()
    if (filters?.page) params.append("page", filters.page.toString())
    if (filters?.limit) params.append("limit", filters.limit.toString())

    const query = params.toString()
    const endpoint = query ? `/resources/my-resources?${query}` : "/resources/my-resources"

    return apiClient.get<ListResourcesResponse>(endpoint, token)
  },

  // Track resource download (protected)
  async downloadResource(token: string, id: string) {
    return apiClient.post<{ success: boolean; message: string; data: { id: string; downloads: number } }>(
      `/resources/${id}/download`,
      {},
      token,
    )
  },

  // Delete resource (protected)
  async deleteResource(token: string, id: string) {
    return apiClient.delete<{ success: boolean; message: string; data: { message: string } }>(`/resources/${id}`, token)
  },
}
