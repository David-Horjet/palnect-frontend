"use client"

import { Poppins } from "next/font/google"
import "./globals.css"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/lib/contexts/ThemeContext"

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400"
})

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#6366F1" />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
