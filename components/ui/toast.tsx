"use client"

import { useState, useEffect } from "react"

interface ToastProps {
  message: string
  type?: "success" | "error" | "info" | "warning"
  duration?: number
  onClose?: () => void
}

interface Toast extends ToastProps {
  id: string
}

const toastStore: { toasts: Toast[]; listeners: Set<() => void> } = {
  toasts: [],
  listeners: new Set(),
}

export function showToast(props: ToastProps) {
  const id = Math.random().toString(36).slice(2)
  const toast: Toast = { ...props, id, duration: props.duration || 3000 }

  toastStore.toasts.push(toast)
  toastStore.listeners.forEach((listener) => listener())

  setTimeout(() => {
    toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id)
    toastStore.listeners.forEach((listener) => listener())
  }, toast.duration)

  return id
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handleUpdate = () => setToasts([...toastStore.toasts])
    toastStore.listeners.add(handleUpdate)
    return () => toastStore.listeners.delete(handleUpdate)
  }, [])

  const typeStyles = {
    success: "bg-success text-white",
    error: "bg-destructive text-white",
    info: "bg-info text-white",
    warning: "bg-warning text-white",
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "rounded-lg px-4 py-3 shadow-lg animate-slide-in-from-bottom text-sm font-medium",
            typeStyles[toast.type || "info"],
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
