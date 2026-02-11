import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings | Palnect",
  description: "Account and application settings for your Palnect profile.",
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
