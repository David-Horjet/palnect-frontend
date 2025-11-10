import * as React from 'react'
import { cn } from '@/lib/utils'

export const Dialog = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

export function DialogProvider({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const dialogOpen = isControlled ? open : internalOpen

  return (
    <Dialog.Provider
      value={{
        open: dialogOpen,
        setOpen: (newOpen) => {
          if (!isControlled) setInternalOpen(newOpen)
          onOpenChange?.(newOpen)
        },
      }}
    >
      {children}
    </Dialog.Provider>
  )
}

export function DialogTrigger({
  children,
  asChild = false,
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  const context = React.useContext(Dialog)
  if (!context) throw new Error('DialogTrigger must be used within Dialog')

  const Comp = asChild ? React.Fragment : 'button'

  return (
    <Comp
      onClick={() => context.setOpen(true)}
      className={cn(
        !asChild && 'px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition'
      )}
    >
      {children}
    </Comp>
  )
}

export function DialogContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const context = React.useContext(Dialog)
  if (!context) throw new Error('DialogContent must be used within Dialog')

  if (!context.open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={() => context.setOpen(false)}
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform">
        <div
          className={cn(
            'rounded-lg border border-input bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 shadow-lg',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export function DialogHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col space-y-1.5 border-b border-input p-6', className)}>
      {children}
    </div>
  )
}

export function DialogFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex justify-end gap-3 border-t border-input p-6', className)}>
      {children}
    </div>
  )
}

export function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
      {children}
    </h2>
  )
}

export function DialogDescription({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}

export function DialogClose({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  const context = React.useContext(Dialog)
  if (!context) throw new Error('DialogClose must be used within Dialog')

  return (
    <button
      onClick={() => context.setOpen(false)}
      className={cn(
        'rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      {children || 'Close'}
    </button>
  )
}

export function DialogBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}