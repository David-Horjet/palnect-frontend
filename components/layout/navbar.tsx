"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 top-0 z-50 w-full py-7 lg:py-0 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="relative mx-auto max-w-[1170px] items-center justify-between px-4 sm:px-8 lg:flex xl:px-0">
        {/* Logo */}
        <div className="flex w-full items-center justify-between lg:w-1/4">
          <Link href="/" className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
              Palnect
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="block lg:hidden text-white hover:text-purple-400 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } invisible h-0 w-full items-center justify-between lg:visible lg:flex lg:h-auto lg:w-3/4`}
        >
          <nav className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8 lg:pl-12">
            <Link href="/#home" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
              Home
            </Link>
            <Link href="/#features" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              About
            </Link>
            <Link href="/#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Blog
            </Link>
            <Link href="/#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Docs
            </Link>
            <Link href="/#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Pages
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4 lg:ml-auto pt-4 lg:pt-0">
            <Link href="/signin" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border border-purple-500/50 bg-purple-500/10 px-6 py-2.5 text-white text-sm font-medium hover:bg-purple-500/20 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
