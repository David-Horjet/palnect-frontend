import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Credits | Palnect",
  description: "Buy and manage your Palnect credits to access premium services.",
}

export default function CreditsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
