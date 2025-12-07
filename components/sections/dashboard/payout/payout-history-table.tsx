"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchPayoutHistory } from "@/store/slices/payoutSlice"
import { formatDate } from "@/lib/utils"

export function PayoutHistoryTable() {
  const dispatch = useDispatch<AppDispatch>()
  const { payoutHistory, loading } = useSelector((state: RootState) => state.payout)
  const { token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(fetchPayoutHistory({ token }))
    }
  }, [dispatch, token])

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
      case "approved":
        return "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
      case "paid":
        return "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
      case "declined":
        return "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Payout History</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (payoutHistory.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Payout History</h2>
        <p className="text-center py-8 text-muted-foreground">No payout requests yet</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Payout History</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-sidebar">
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount (₦)</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Points</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Reason</th>
            </tr>
          </thead>
          <tbody>
            {payoutHistory.map((payout) => (
              <tr key={payout.id} className="border-b border-border hover:bg-sidebar/50 transition-colors">
                <td className="px-6 py-4 text-sm text-foreground">{formatDate(payout.created_at)}</td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  ₦{payout.amount_naira.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{payout.amount_points.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(payout.status)}`}
                  >
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {payout.decline_reason || (payout.status === "declined" ? "No reason provided" : "-")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
