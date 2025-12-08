"use client"

import React from "react"

import type { ReactNode } from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: ReactNode
}

interface TabsListProps {
  className?: string
  children: ReactNode
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  className?: string
}

interface TabsContentProps {
  value: string
  className?: string
  children: ReactNode
}

export function Tabs({ defaultValue, value: controlledValue, onValueChange, className, children }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "")
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              _value: value,
              _onValueChange: handleValueChange,
            })
          : child,
      )}
    </div>
  )
}

export function TabsList({ className, children }: TabsListProps) {
  return <div className={cn("flex gap-1 border-b border-border", className)}>{children}</div>
}

export function TabsTrigger({
  value,
  className,
  children,
  onClick,
  ...props
}: TabsTriggerProps & { _value?: string; _onValueChange?: (v: string) => void }) {
  const isActive = props._value === value

  return (
    <button
      onClick={(e) => {
        props._onValueChange?.(value)
        onClick?.(e)
      }}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-transparent text-muted-foreground hover:text-foreground",
        isActive && "border-primary text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps & { _value?: string }) {
  const isActive = props._value === value

  if (!isActive) return null

  return (
    <div className={cn("py-4", className)} {...props}>
      {children}
    </div>
  )
}
