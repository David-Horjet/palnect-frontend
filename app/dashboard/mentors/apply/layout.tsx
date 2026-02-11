import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Apply to be a Mentor | Palnect",
  description: "Apply to join Palnect as a mentor and offer guidance to students.",
}

export default function MentorApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
