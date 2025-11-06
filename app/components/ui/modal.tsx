"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  className?: string
}

export function Modal({ isOpen, onClose, children, title, className }: ModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-scale-in">
        <div
          className={cn(
            "bg-card text-card-foreground rounded-xl border border-border shadow-xl max-w-md w-full max-h-[90vh] overflow-auto",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold">{title}</h2>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  )
}
