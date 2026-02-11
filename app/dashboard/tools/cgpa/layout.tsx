import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "CGPA Calculator | Palnect",
  description: "Calculate your CGPA and track academic progress.",
}

export default function CgpaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
