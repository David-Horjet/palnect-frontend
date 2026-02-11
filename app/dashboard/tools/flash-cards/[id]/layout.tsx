import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flash Card | Palnect",
  description: "View and study a single flash card.",
}

export default function FlashCardIdLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
