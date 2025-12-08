"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { getConversionRate, fetchPayoutHistory } from "@/store/slices/payoutSlice"
import { AccountDetailsForm } from "@/components/sections/dashboard/payout/account-details-form"
import { PayoutHistoryTable } from "@/components/sections/dashboard/payout/payout-history-table"
import { PayoutRequestForm } from "@/components/sections/dashboard/payout/payout-request-form"

export default function PayoutPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { balance } = useSelector((state: RootState) => state.points)
  const { token } = useSelector((state: RootState) => state.auth)
  const { conversionRate, isPayoutEnabled } = useSelector((state: RootState) => state.payout)

  useEffect(() => {
    if (token) {
      dispatch(getConversionRate({ token }))
      dispatch(fetchPayoutHistory({ token }))
    }
  }, [dispatch, token])

  const nairaAmount = (balance * conversionRate).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  })

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Request Payout</h1>
          <p className="text-muted-foreground">Withdraw your earned points as Naira to your bank account.</p>
        </div>

        {/* Points Balance Card */}
        <div className="bg-linear-to-r from-primary to-purple-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90">Your Points Balance</p>
          <p className="text-4xl font-bold mt-2">{balance.toLocaleString()}</p>
          <p className="text-sm opacity-90 mt-3">Equivalent: {nairaAmount}</p>
          <p className="text-xs opacity-75 mt-1">1 point = ₦{conversionRate.toFixed(4)}</p>
          {!isPayoutEnabled && (
            <p className="text-sm mt-3 bg-red-500 bg-opacity-30 px-3 py-1 rounded inline-block">
              Payouts currently disabled
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Account Details Section */}
          <AccountDetailsForm />

          {/* Payout Request Section */}
          <PayoutRequestForm />

          {/* History Section */}
          <PayoutHistoryTable />
        </div>
      </div>
    </div>
  )
}
