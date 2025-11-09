import { Poppins } from "next/font/google"
import "./globals.css"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import Providers from "@/components/providers"

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400"
})

export const metadata: Metadata = {
  title: "Palnect",
  description: "Your Gateway to Seamless Learning and Collaboration",
}

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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
