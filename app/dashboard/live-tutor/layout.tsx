import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Live Tutor | Palnect",
  description: "Join live tutoring sessions and get real-time help from tutors.",
}

export default function LiveTutorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
