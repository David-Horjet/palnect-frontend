import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile | Palnect",
  description: "View and edit your Palnect profile and account settings.",
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
