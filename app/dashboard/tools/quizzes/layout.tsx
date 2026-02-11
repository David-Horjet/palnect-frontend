import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quizzes | Palnect",
  description: "Take quizzes to test your knowledge and track progress.",
}

export default function QuizzesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
