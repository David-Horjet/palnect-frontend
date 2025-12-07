"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { AccountDetailsForm } from "@/components/sections/dashboard/payout/account-details-form"
import { PayoutHistoryTable } from "@/components/sections/dashboard/payout/payout-history-table"
import { PayoutRequestForm } from "@/components/sections/dashboard/payout/payout-request-form"

export default function PayoutPage() {
  const { balance } = useSelector((state: RootState) => state.points)

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
          <p className="text-sm opacity-90 mt-3">1 point = ₦0.01 (approximately)</p>
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
