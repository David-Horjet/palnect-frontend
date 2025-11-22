"use client"

import { Dialog, DialogContent, DialogHeader, DialogProvider, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, Copy, CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "@/lib/toast"

interface PurchaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentUrl: string | null
  reference: string | null
  loading?: boolean
}

export function PurchaseModal({ open, onOpenChange, paymentUrl, reference, loading = false }: PurchaseModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyReference = () => {
    if (reference) {
      navigator.clipboard.writeText(reference)
      setCopied(true)
      toast.success("Reference copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleOpenPayment = () => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank", "width=800,height=600")
    }
  }

  return (
    <DialogProvider open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-foreground">Processing Payment</h3>
              <p className="text-sm text-muted-foreground">Initializing your payment link...</p>
            </div>
          </div>
        ) : paymentUrl ? (
          <div className="space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Payment Link Ready</p>
                  <p className="text-sm text-muted-foreground">
                    Click the button below to complete your payment securely with Paystack.
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Reference Number</p>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-muted/30 rounded-lg border border-border">
                  <p className="text-sm font-mono text-muted-foreground break-all">{reference}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyReference} className="px-3 bg-transparent">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Save this reference for your records</p>
            </div>

            <Button size="lg" onClick={handleOpenPayment} className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Payment Link
            </Button>

            <Card className="p-3 bg-muted/30 border-border/50">
              <p className="text-xs text-muted-foreground">
                After completing payment, you'll be redirected to verify. If you don't see the verification page, come
                back here and check your transaction history to confirm.
              </p>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  window.location.href = `/dashboard/credits/verify?reference=${reference}`
                }}
              >
                Verify Payment
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No active payment. Select a package to continue.</p>
            </Card>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </DialogProvider>
  )
}
