import { io, type Socket } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ["websocket", "polling"],
})

socket.on("connect", () => {
  console.log("[Socket] Connected:", socket.id)
})

socket.on("disconnect", (reason) => {
  console.log("[Socket] Disconnected:", reason)
})

socket.on("connect_error", (error) => {
  console.error("[Socket] Connection error:", error.message)
})

socket.on("error", (error) => {
  console.error("[Socket] Error:", error)
})
