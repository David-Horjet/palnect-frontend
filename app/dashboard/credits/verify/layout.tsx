import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Verify Purchase | Palnect",
  description: "Verify credit purchases and payment confirmations.",
}

export default function CreditsVerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
