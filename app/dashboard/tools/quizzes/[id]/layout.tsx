import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quiz | Palnect",
  description: "Take the quiz and test your knowledge.",
}

export default function QuizIdLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
