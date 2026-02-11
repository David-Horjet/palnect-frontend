import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chat Lexi | Palnect",
  description: "Chat with Lexi, your AI learning assistant on Palnect.",
}

export default function LexiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
