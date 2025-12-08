"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchPayoutStats, fetchAdminPayouts } from "@/store/slices/payoutSlice"
import { useAuth } from "@/hooks/useAuth"

export default function AdminPayoutPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useAuth()
  const { payoutStats, conversionRate, minPayoutPoints, maxPayoutPoints, isPayoutEnabled, adminLoading } = useSelector(
    (state: RootState) => state.payout,
  )
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "approved" | "paid" | "declined" | undefined>(
    "pending",
  )

  useEffect(() => {
    if (!token) return

    dispatch(fetchPayoutStats({ token }))
    dispatch(fetchAdminPayouts({ token, status: "pending" }))
  }, [token, dispatch])

  const handleStatusChange = (status: string) => {
    if (!token) return
    setSelectedStatus(status as any)
    dispatch(fetchAdminPayouts({ token, status: status as any }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payout Management</h1>
        <p className="text-muted-foreground">Manage user payout requests and system settings</p>
      </div>

      {payoutStats && (
        <PayoutStatsCard
          pendingCount={payoutStats.pending_count}
          conversionRate={payoutStats.conversion_rate}
          minPayout={payoutStats.min_payout}
          maxPayout={payoutStats.max_payout}
          isEnabled={payoutStats.is_enabled}
        />
      )}

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" onClick={() => handleStatusChange("pending")}>
            Pending
          </TabsTrigger>
          <TabsTrigger value="approved" onClick={() => handleStatusChange("approved")}>
            Approved
          </TabsTrigger>
          <TabsTrigger value="paid" onClick={() => handleStatusChange("paid")}>
            Paid
          </TabsTrigger>
          <TabsTrigger value="declined" onClick={() => handleStatusChange("declined")}>
            Declined
          </TabsTrigger>
        </TabsList>
        <TabsContent value={selectedStatus || "pending"} className="mt-4">
          <PayoutRequestsTable status={selectedStatus as any} />
        </TabsContent>
      </Tabs>

      <PayoutSettingsForm />
    </div>
  )
}
