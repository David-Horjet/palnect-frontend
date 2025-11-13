"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: any
  error?: string
  helperText?: string
  required?: boolean
  multiline?: boolean
  rows?: number
  disabled?: boolean
  min?: string | number
  max?: string | number
  minLength?: number
  maxLength?: number
  pattern?: string
  step?: string | number
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  inputClassName?: string
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  multiline = false,
  rows = 4,
  disabled = false,
  min,
  max,
  minLength,
  maxLength,
  pattern,
  step,
  onBlur,
  onFocus,
  inputClassName,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {multiline ? (
        <Textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          rows={rows}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          className={
            inputClassName && error
              ? `border-destructive ${inputClassName}`
              : error
                ? "border-destructive"
                : inputClassName
          }
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          min={min}
          max={max}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          step={step}
          className={
            inputClassName && error
              ? `border-destructive ${inputClassName}`
              : error
                ? "border-destructive"
                : inputClassName
          }
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  )
}
