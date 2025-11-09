// Toast notification system
interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

let toastCallbacks: ((toast: Toast) => void)[] = []

export const toast = {
  subscribe: (callback: (toast: Toast) => void) => {
    toastCallbacks.push(callback)
    return () => {
      toastCallbacks = toastCallbacks.filter((cb) => cb !== callback)
    }
  },

  show: (message: string, type: "success" | "error" | "info" = "info", duration = 3000) => {
    const id = Math.random().toString(36).substring(7)
    const toastData: Toast = { id, message, type, duration }
    toastCallbacks.forEach((callback) => callback(toastData))
    return id
  },

  success: (message: string, duration?: number) => toast.show(message, "success", duration),
  error: (message: string, duration?: number) => toast.show(message, "error", duration),
  info: (message: string, duration?: number) => toast.show(message, "info", duration),
}

export type { Toast }
