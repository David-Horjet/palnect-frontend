import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Subscriptions | Palnect",
  description: "Manage your mentor subscriptions and billing details.",
}

export default function SubscriptionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
