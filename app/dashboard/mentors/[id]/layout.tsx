import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentor Profile | Palnect",
  description: "View mentor profile and start a mentorship on Palnect.",
}

export default function MentorIdLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
