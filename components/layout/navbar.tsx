"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../ui/button"

export function Navbar() {
  const [theme, setTheme] = useState("light")

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-lg text-foreground">Palnect</span>
          </Link>

          {/* Center Navigation (for authenticated users - will be added later) */}
          <div className="hidden md:flex items-center gap-8" />

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <Button variant="ghost" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="primary" size="sm">
              <Link href="/signup">Join Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
