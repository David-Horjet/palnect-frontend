"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { approvePayoutRequest, markPayoutAsPaid, declinePayoutRequest } from "@/store/slices/payoutSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/utils"
import { CheckCircle, XCircle, Clock, DollarSign } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface PayoutRequestsTableProps {
  status?: "pending" | "approved" | "paid" | "declined"
}

export function PayoutRequestsTable({ status }: PayoutRequestsTableProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useAuth()
  const { adminPayouts, adminLoading } = useSelector((state: RootState) => state.payout)
  const [declineReason, setDeclineReason] = useState("")
  const [declineModalOpen, setDeclineModalOpen] = useState(false)
  const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null)

  const handleApprove = async (payoutId: string) => {
    if (!token) return
    await dispatch(approvePayoutRequest({ token, payoutId }))
  }

  const handleMarkAsPaid = async (payoutId: string) => {
    if (!token) return
    await dispatch(markPayoutAsPaid({ token, payoutId }))
  }

  const handleDecline = async () => {
    if (!token || !selectedPayoutId) return
    await dispatch(declinePayoutRequest({ token, payoutId: selectedPayoutId, reason: declineReason }))
    setDeclineModalOpen(false)
    setDeclineReason("")
    setSelectedPayoutId(null)
  }

  const openDeclineModal = (payoutId: string) => {
    setSelectedPayoutId(payoutId)
    setDeclineModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; icon: any }> = {
      pending: { variant: "outline", icon: Clock },
      approved: { variant: "secondary", icon: CheckCircle },
      paid: { variant: "default", icon: DollarSign },
      declined: { variant: "destructive", icon: XCircle },
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const filteredPayouts = status ? adminPayouts.filter((payout) => payout.status === status) : adminPayouts

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout Requests {status && `(${status})`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">User</th>
                <th className="text-left py-3 px-4 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 font-semibold">Bank Details</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No payout requests found
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">
                          {payout.user.first_name} {payout.user.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{payout.user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">₦{payout.amount_naira.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{payout.amount_points} points</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs">
                        <p className="font-medium">{payout.bank_account?.account_holder_name}</p>
                        <p className="text-muted-foreground">{payout.bank_account?.bank_name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(payout.status)}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{formatDate(payout.created_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {payout.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApprove(payout.id)}
                              disabled={adminLoading}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openDeclineModal(payout.id)}
                              disabled={adminLoading}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                        {payout.status === "approved" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleMarkAsPaid(payout.id)}
                            disabled={adminLoading}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={declineModalOpen} onClose={() => setDeclineModalOpen(false)} title="Decline Payout Request">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason for declining</label>
              <Input
                placeholder="Enter reason..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setDeclineModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDecline} disabled={!declineReason || adminLoading}>
                Decline
              </Button>
            </div>
          </div>
        </Modal>
      </CardContent>
    </Card>
  )
}
