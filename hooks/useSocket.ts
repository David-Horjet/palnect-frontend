"use client"

import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"
import type { Socket } from "socket.io-client"

export function useSocket(): Socket | null {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      console.warn("[v0] No token found, socket not initialized")
      return
    }

    // Initialize socket connection
    socket.auth = { token }
    socket.connect()

    setSocketInstance(socket)

    socket.on("connect", () => {
      console.log("[v0] Socket connected:", socket.id)
    })

    socket.on("disconnect", () => {
      console.log("[v0] Socket disconnected")
    })

    socket.on("error", (error) => {
      console.error("[v0] Socket error:", error)
    })

    return () => {
      if (socket.connected) {
        socket.disconnect()
      }
    }
  }, [])

  return socketInstance
}
