import type React from "react"
import { ProtectedRoute } from "@/middleware/protected-route"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Palnect",
  description: "Your student learning dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
