"use client"

import { useCallback } from "react"
import { toast } from "@/lib/toast"

interface PaystackConfig {
  accessCode: string
  onSuccess?: (transaction: any) => void
  onCancel?: () => void
  onError?: (error: any) => void
}

declare global {
  interface Window {
    PaystackPop: any
  }
}

export function usePaystackModal() {
  const initializePayment = useCallback((config: PaystackConfig) => {
    const { accessCode, onSuccess, onCancel, onError } = config

    if (!window.PaystackPop) {
      toast.error("Paystack is not loaded. Please refresh the page.")
      return
    }

    try {
      const popup = new window.PaystackPop()

      popup.resumeTransaction(accessCode, {
        onSuccess: (transaction: any) => {
          console.log("[v0] Payment successful:", transaction)
          if (onSuccess) {
            onSuccess(transaction)
          }
        },
        onCancel: () => {
          console.log("[v0] Payment cancelled")
          if (onCancel) {
            onCancel()
          }
        },
        onError: (error: any) => {
          console.log("[v0] Payment error:", error)
          if (onError) {
            onError(error)
          }
        },
      })
    } catch (error) {
      console.error("[v0] Failed to initialize Paystack:", error)
      toast.error("Failed to initialize payment. Please try again.")
    }
  }, [])

  return { initializePayment }
}
