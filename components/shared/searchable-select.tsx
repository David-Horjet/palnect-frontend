"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, X } from 'lucide-react'

interface SearchableSelectProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  options: string[]
  error?: string
  disabled?: boolean
  searchPlaceholder?: string
}

export function SearchableSelect({
  label,
  placeholder = "Select an option",
  value,
  onChange,
  options,
  error,
  disabled = false,
  searchPlaceholder = "Search...",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="w-full" ref={containerRef}>
      {label && <label className="block text-sm font-medium text-foreground mb-2">{label}</label>}

      <div className="relative">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full text-sm md:text-base px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center justify-between",
            error && "border-destructive focus:ring-destructive",
            isOpen && "ring-2 ring-ring",
          )}
        >
          <span className={value ? "text-foreground" : "text-muted-foreground"}>
            {value || placeholder}
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-lg shadow-lg z-50">
            <div className="p-2">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onChange(option)
                      setIsOpen(false)
                      setSearchTerm("")
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors",
                      value === option && "bg-primary text-primary-foreground",
                    )}
                  >
                    {option}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-muted-foreground">No options found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  )
}
