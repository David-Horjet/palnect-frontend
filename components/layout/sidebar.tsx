"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SidebarLink {
  label: string
  href: string
  icon?: string
  badge?: number
}

interface SidebarProps {
  links: SidebarLink[]
  currentPath?: string
  onLinkClick?: (href: string) => void
}

export function Sidebar({ links, currentPath = "/", onLinkClick }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-4 left-4 z-40 p-2 rounded-lg bg-primary text-primary-foreground"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar text-sidebar-foreground transition-transform duration-300 md:static md:translate-x-0 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onLinkClick?.(link.href)}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors duration-200",
                currentPath === link.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                  : "hover:bg-sidebar-accent/20 text-sidebar-foreground",
              )}
            >
              <div className="flex items-center gap-3">
                {link.icon && <span className="text-lg">{link.icon}</span>}
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-30 mt-16" onClick={() => setIsOpen(false)} />}
    </>
  )
}
