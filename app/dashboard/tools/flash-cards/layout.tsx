import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flash Cards | Palnect",
  description: "Study with flash cards and quick-recall exercises.",
}

export default function FlashCardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
