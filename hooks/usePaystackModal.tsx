"use client"

import { useCallback } from "react"
import { toast } from "@/lib/toast"

interface PaystackConfig {
  email: string
  amount: number
  reference: string
  publicKey: string
  onSuccess?: () => void
  onClose?: () => void
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string
        email: string
        amount: number
        ref: string
        onClose: () => void
        onSuccess: (response: { reference: string }) => void
      }) => { openIframe: () => void }
    }
  }
}

export function usePaystackModal() {
  const initializePayment = useCallback((config: PaystackConfig) => {
    const { email, amount, reference, publicKey, onSuccess, onClose } = config

    if (!window.PaystackPop) {
      toast.error("Paystack is not loaded. Please refresh the page.")
      return
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: amount,
      ref: reference,
      onSuccess: (response) => {
        if (onSuccess) {
          onSuccess()
        }
      },
      onClose: () => {
        if (onClose) {
          onClose()
        }
      },
    })

    handler.openIframe()
  }, [])

  return { initializePayment }
}
