import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentors | Palnect",
  description: "Find and connect with mentors to support your learning.",
}

export default function MentorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
