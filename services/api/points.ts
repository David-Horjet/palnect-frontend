import { apiClient } from "@/lib/api"

export const pointsService = {
  getBalance: async (token: string) => {
    const response = await apiClient.get("/points/balance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  purchasePoints: async (token: string, amount: number, email: string) => {
    const response = await apiClient.post(
      "/points/purchase",
      {
        amount,
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  },

  verifyPayment: async (token: string, reference: string) => {
    const response = await apiClient.get(`/points/verify?reference=${reference}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  getTransactions: async (token: string, page = 1, limit = 20) => {
    const response = await apiClient.get("/points/transactions", {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },
}
