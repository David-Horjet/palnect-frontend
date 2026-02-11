import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resource Details | Palnect",
  description: "View resource details, download, and interact with shared materials.",
}

export default function ResourceIdLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
