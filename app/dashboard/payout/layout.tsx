import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Payouts | Palnect",
  description: "Manage your payouts and payment methods on Palnect.",
}

export default function PayoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
