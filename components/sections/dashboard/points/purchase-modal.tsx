"use client"

import { DialogContent, DialogHeader, DialogProvider, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { usePaystackModal } from "@/hooks/usePaystackModal"
import { toast } from "@/lib/toast"
import { useRouter } from "next/navigation"

interface PurchaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentUrl: string | null
  reference: string | null
  loading?: boolean
  paymentData?: {
    reference: string | null
    email: string | null
    amount: number | null
    accessCode: string | null
  }
}

export function PurchaseModal({
  open,
  onOpenChange,
  paymentUrl,
  reference,
  loading = false,
  paymentData,
}: PurchaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { initializePayment } = usePaystackModal()
  const router = useRouter()

  const handlePaymentClick = () => {
    if (!paymentData?.reference || !paymentData?.email || !paymentData?.amount) return

    setIsProcessing(true)

    try {
      initializePayment({
        email: paymentData.email,
        amount: paymentData.amount,
        reference: paymentData.reference,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        onSuccess: () => {
          console.log("🎉 Payment success event triggered");
          setIsProcessing(false)
          toast.success("Payment successful! Redirecting to verification...")
          setTimeout(() => {
            router.push(`/dashboard/credits/verify?reference=${paymentData.reference}`)
          }, 500)
        },
        onClose: () => {
          setIsProcessing(false)
          toast.info("Payment window closed. You can retry anytime.")
        },
      })
    } catch (error) {
      setIsProcessing(false)
      toast.error("Failed to initialize payment. Please try again.")
    }
  }

  console.log(loading, isProcessing)
  return (
    <DialogProvider open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
        </DialogHeader>

        {loading || isProcessing ? (
          <div className="space-y-4 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-foreground">Processing Payment</h3>
              <p className="text-sm text-muted-foreground">Initializing secure payment...</p>
            </div>
          </div>
        ) : paymentUrl ? (
          <div className="space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-xl font-bold text-foreground">₦{(paymentData?.amount || 0) / 100}</p>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-semibold text-foreground">{paymentData?.email}</p>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="text-xs font-mono text-foreground">{paymentData?.reference}</p>
                </div>
              </div>
            </Card>

            {/* <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Ready to Pay</p>
                  <p className="text-sm text-muted-foreground">
                    Click the button below to open the secure Paystack payment modal and complete your transaction.
                  </p>
                </div>
              </div>
            </Card> */}

            <Button size="lg" onClick={handlePaymentClick} disabled={isProcessing} className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay now"
              )}
            </Button>

            <Card className="p-3 bg-muted/20 border-border/50">
              <p className="text-xs text-muted-foreground">
                A secure Paystack payment modal will open. Complete the payment using your card, bank transfer, or
                mobile money.
              </p>
            </Card>

            <Button variant="outline" className="w-full bg-transparent" onClick={() => onOpenChange(false)}>
              Close
            </Button>
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
