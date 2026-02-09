import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tools | Palnect",
  description: "Academic tools like calculators, quizzes and study aids.",
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
