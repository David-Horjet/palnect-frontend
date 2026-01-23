import React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function RadioGroup({ value, onValueChange, children, className }: RadioGroupProps) {
  return (
    <div className={cn("space-y-2", className)} role="radiogroup">
      {React.Children.map(children, (child) =>
        React.isValidElement<RadioGroupItemProps>(child)
          ? React.cloneElement(child, {
              checked: child.props.value === value,
              onChange: () => onValueChange?.(child.props.value),
            })
          : child
      )}
    </div>
  )
}

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
}

export function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <input
      type="radio"
      className={cn("h-4 w-4 text-primary border-gray-300 focus:ring-primary", className)}
      {...props}
    />
  )
}