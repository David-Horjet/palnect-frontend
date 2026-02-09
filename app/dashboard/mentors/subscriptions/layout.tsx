import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentor Subscriptions | Palnect",
  description: "View and manage your subscriptions to mentors.",
}

export default function MentorsSubscriptionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
