import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Messages | Palnect",
  description: "View and manage your conversations with mentors and peers.",
}

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
