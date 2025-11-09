import type React from "react"
import { ProtectedRoute } from "@/middleware/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
