"use client"

import { useState, useEffect } from "react"
import { toast as toastSystem, type Toast } from "@/lib/toast"
import { X } from "lucide-react"

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const unsubscribe = toastSystem.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast])

      if (newToast.duration !== Number.POSITIVE_INFINITY) {
        const timer = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id))
        }, newToast.duration || 3000)

        return () => clearTimeout(timer)
      }
    })

    return unsubscribe
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-4 rounded-lg shadow-lg flex items-start gap-3 animate-slide-in ${
            t.type === "success"
              ? "bg-green-500 text-white"
              : t.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
          }`}
        >
          <div className="flex-1">{t.message}</div>
          <button onClick={() => removeToast(t.id)} className="opacity-80 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
