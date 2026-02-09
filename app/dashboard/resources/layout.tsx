import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resources | Palnect",
  description: "Browse and access study resources shared by the community.",
}

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
