"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { verifyPayment, fetchBalance } from "@/store/slices/pointsSlice"
import { useAuth } from "@/hooks/useAuth"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

export default function VerifyPaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reference = searchParams.get("reference")
  const dispatch = useDispatch() as AppDispatch
  const { token } = useAuth()
  const { loading, error } = useSelector((state: RootState) => state.points)
  const [verificationAttempted, setVerificationAttempted] = useState(false)
  const [verificationResult, setVerificationResult] = useState<"pending" | "success" | "failed">("pending")

  const hasVerifiedRef = useRef(false)

  useEffect(() => {
    console.log("debugging: ", token, reference, verificationResult, verificationAttempted)
    if (!hasVerifiedRef.current && token && reference && verificationResult === "pending" && !verificationAttempted) {
      hasVerifiedRef.current = true
      handleVerify();
    }
  }, [token, reference, verificationResult, verificationAttempted]);

  const handleVerify = async () => {
    try {
      const result = await dispatch(verifyPayment({ token: token!, reference: reference! }));

      if (result.type.endsWith("/fulfilled")) {
        setVerificationResult("success");
        if (token) dispatch(fetchBalance({ token }));
      } else {
        setVerificationResult("failed");
      }
    } catch {
      setVerificationResult("failed");
    } finally {
      setVerificationAttempted(true);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="points" />

      <main className="flex-1 overflow-auto flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8">
          {loading && verificationResult === "pending" ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative h-16 w-16">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-foreground mb-2">Verifying Payment</h1>
                <p className="text-xs md:text-sm text-muted-foreground">Securely confirming your transaction with Paystack...</p>
              </div>
              <div className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-xs text-muted-foreground">Processing payment</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                    <p className="text-xs text-muted-foreground">Crediting in progress...</p>
                  </div>
                </div>
              </div>
            </div>
          ) : verificationResult === "success" ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-primary mx-auto" />
              <div>
                <h1 className="text-lg md:text-xl font-bold text-foreground mb-2">Payment Successful</h1>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">
                  Your credits have been added to your account. You can now use them within the app.
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={() => router.push("/dashboard/credits")} className="w-full">
                  View Credits Balance
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard/mentors")} className="w-full">
                  Browse Mentors
                </Button>
              </div>
            </div>
          ) : verificationResult === "failed" ? (
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h1 className="text-lg md:text-xl font-bold text-foreground mb-2">Verification Failed</h1>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">
                  {error || "We couldn't verify your payment. Please try again or contact support."}
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleVerify} disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Retrying..." : "Try Again"}
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard/credits")} className="w-full">
                  Back to Credits
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      </main>
    </div>
  )
}
