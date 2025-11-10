"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
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
  const { loading } = useSelector((state: RootState) => state.points)
  const [verificationAttempted, setVerificationAttempted] = useState(false)
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  useEffect(() => {
    if (token && reference && !verificationAttempted) {
      handleVerify()
    }
  }, [token, reference])

  const handleVerify = async () => {
    setVerificationAttempted(true)
    try {
      const result = await dispatch(verifyPayment({ token: token!, reference: reference! }))
      if (result.payload) {
        setVerificationSuccess(true)
        if (token) {
          dispatch(fetchBalance({ token }))
        }
      }
    } catch (error: any) {
      setVerificationError(error?.message || "Failed to verify payment")
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="points" />

      <main className="flex-1 overflow-auto flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8">
          {loading && !verificationAttempted ? (
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Verifying Payment</h1>
                <p className="text-muted-foreground">Please wait while we verify your payment...</p>
              </div>
            </div>
          ) : verificationSuccess ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-primary mx-auto" />
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Payment Successful</h1>
                <p className="text-muted-foreground mb-4">
                  Your points have been added to your account. You can now use them to subscribe to mentors.
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={() => router.push("/dashboard/points")} className="w-full">
                  View Points Balance
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard/mentors")} className="w-full">
                  Browse Mentors
                </Button>
              </div>
            </div>
          ) : verificationError || (verificationAttempted && !verificationSuccess) ? (
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h1>
                <p className="text-muted-foreground mb-4">
                  {verificationError || "We couldn't verify your payment. Please try again or contact support."}
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleVerify} disabled={loading} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard/points")} className="w-full">
                  Back to Points
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      </main>
    </div>
  )
}
