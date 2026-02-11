import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Upload Resource | Palnect",
  description: "Upload study materials and resources to share with peers.",
}

export default function ResourcesUploadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
