"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchBalance, purchasePoints, fetchTransactions } from "@/store/slices/pointsSlice"
import { useAuth } from "@/hooks/useAuth"
import { Zap, History, ArrowDown, ArrowUp, CheckCircle, Loader2 } from "lucide-react"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { PurchaseModal } from "@/components/sections/dashboard/points/purchase-modal"

interface PointsPackage {
  id: string
  naira: number
  kobo: number
  points: number
  bonus: number
  popular?: boolean
}

export default function PointsPage() {
  const dispatch = useDispatch() as AppDispatch
  const { token, user } = useAuth()
  const { balance, transactions, loading, pagination, paymentUrl, paymentReference } = useSelector(
    (state: RootState) => state.points,
  )
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (token) {
      dispatch(fetchBalance({ token }))
      dispatch(fetchTransactions({ token, page: currentPage }))
    }
  }, [dispatch, token, currentPage])

  const packages: PointsPackage[] = [
    { id: "1", naira: 100, kobo: 10000, points: 10, bonus: 0 },
    { id: "2", naira: 500, kobo: 50000, points: 55, bonus: 5, popular: true },
    { id: "3", naira: 1000, kobo: 100000, points: 115, bonus: 15 },
    { id: "4", naira: 2000, kobo: 200000, points: 240, bonus: 40, popular: true },
  ]

  const handlePurchase = () => {
    console.log("Selected package:", selectedPackage, token, user?.email)
    if (selectedPackage && token && user?.email) {
      const pkg = packages.find((p) => p.id === selectedPackage)
      if (pkg) {
        dispatch(purchasePoints({ token, amount: pkg.kobo, email: user.email }))
        setShowPurchaseModal(true)
      }
    }
  }

  useEffect(() => {
    if (paymentUrl) {
      setShowPurchaseModal(true)
    }
  }, [paymentUrl])

  const getTransactionIcon = (type: string, amount: number) => {
    if (amount > 0) {
      return <ArrowDown className="h-4 w-4 text-primary" />
    }
    return <ArrowUp className="h-4 w-4 text-destructive" />
  }

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      purchase: "Purchase",
      subscription: "Subscription",
      mentorship_earning: "Earnings",
      admin_credit: "Admin Credit",
      admin_debit: "Admin Debit",
    }
    return labels[type] || type
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="points" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="Points & Purchases" subtitle="Manage your points balance and transaction history" />

        <div className="p-6 space-y-8 max-w-5xl">
          {/* Current Balance */}
          <Card className="bg-linear-to-br from-primary/20 via-accent/20 to-primary/10 border-primary/30 lg:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Your Current Balance
                </p>
                <p className="text-2xl md:text-4xl font-bold text-foreground mb-2">{balance} Points</p>
                <p className="text-xs md:text-sm text-muted-foreground">Use points to subscribe to mentors and unlock services</p>
              </div>
              <Button onClick={() => setSelectedPackage(null)}>
                Buy
              </Button>
            </div>
          </Card>

          {/* Points Packages */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground">Choose Your Package</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`p-4 md:p-6 cursor-pointer transition-all relative ${
                    selectedPackage === pkg.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "hover:border-primary/50"
                  } ${pkg.popular ? "ring-1 ring-accent" : ""}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && <Badge className="absolute top-2 right-2 bg-accent text-foreground">Popular</Badge>}

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Amount</p>
                      <p className="text-xl md:text-2xl font-bold text-foreground">₦{pkg.naira}</p>
                    </div>

                    <div className="pt-3 border-t border-border/50">
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">You Get</p>
                      <div className="space-y-1">
                        <p className="font-bold text-lg md:text-xl text-primary">{pkg.points} Points</p>
                        {pkg.bonus > 0 && (
                          <p className="text-xs text-accent font-semibold">
                            +{pkg.bonus} Bonus ({Math.round((pkg.bonus / pkg.points) * 100)}% extra)
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground pt-2">
                      {Math.round((pkg.points / pkg.naira) * 100) / 100} pts per naira
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {selectedPackage && (
              <div className="mt-6">
                <Card className="bg-muted/20 border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Selected Package</p>
                      <div>
                        {packages.find((p) => p.id === selectedPackage) && (
                          <>
                            <p className="text-2xl font-bold text-foreground">
                              ₦{packages.find((p) => p.id === selectedPackage)?.naira}
                            </p>
                            <p className="text-sm text-accent">
                              {packages.find((p) => p.id === selectedPackage)?.points} Points
                              {(packages.find((p) => p.id === selectedPackage)?.bonus || 0) > 0 &&
                                ` + ${packages.find((p) => p.id === selectedPackage)?.bonus} Bonus`}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <Button size="lg" onClick={handlePurchase} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {loading ? "Processing..." : "Proceed to Payment"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Payments are powered by Paystack. Your transaction will be secure and verified.
                  </p>
                </Card>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                <History className="h-6 w-6" />
                Transaction History
              </h2>
              {/* <Button variant="outline" size="sm">
                Export
              </Button> */}
            </div>

            <Card className="p-[9px] md:p-6">
              {loading && !transactions.length ? (
                <div className="p-12 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <p>No transactions yet. Buy points to get started!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-0">
                    {transactions.map((tx, idx) => (
                      <div
                        key={tx.id}
                        className={`p-2 md:p-4 flex items-start justify-between gap-4 ${
                          idx !== transactions.length - 1 ? "border-b border-border/50" : ""
                        } hover:bg-muted/20 transition-colors`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${tx.amount > 0 ? "bg-primary/10" : "bg-destructive/10"}`}>
                            {getTransactionIcon(tx.type, tx.amount)}
                          </div>

                          <div className="flex-1 gap-2 flex flex-col">
                            <p className="text-sm md:text-base font-semibold text-foreground">{tx.description}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                              {new Date(tx.created_at).toLocaleDateString()}
                              {tx.status === "completed" && (
                                <>
                                  •
                                  <CheckCircle className="h-3 w-3 text-primary" />
                                  Completed
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className={`text-base md:text-lg font-bold ${tx.amount > 0 ? "text-primary" : "text-destructive"}`}>
                            {tx.amount > 0 ? "+" : ""}
                            {tx.amount}
                          </p>
                          <p className="text-xs text-muted-foreground">{getTransactionTypeLabel(tx.type)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination?.totalPages > 1 && (
                    <div className="p-4 border-t border-border/50 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                        {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => p - 1)}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === pagination.totalPages}
                          onClick={() => setCurrentPage((p) => p + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>

          {/* Points Usage Guide */}
          <Card className="bg-muted/20 border-border/50">
            <h3 className="text-base md:text-lg font-bold mb-4 text-foreground">How Points Work</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Badge className="mb-2 bg-primary/20 text-primary">Get Points</Badge>
                <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                  <li>• Purchase points with Paystack</li>
                  <li>• Earn from mentoring students</li>
                  <li>• Get 10 welcome points on signup</li>
                </ul>
              </div>
              <div>
                <Badge className="mb-2 bg-accent/20 text-accent">Use Points</Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Subscribe to mentors (daily/weekly/monthly)</li>
                  <li>• Unlock premium resources</li>
                  <li>• Access exclusive content</li>
                </ul>
              </div>
              <div>
                <Badge className="mb-2 bg-destructive/20 text-destructive">Note</Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Points are non-refundable</li>
                  <li>• Unused points expire after 1 year</li>
                  <li>• Subscriptions auto-expire on due date</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Payment Modal */}
      <PurchaseModal
        open={showPurchaseModal}
        onOpenChange={setShowPurchaseModal}
        paymentUrl={paymentUrl}
        reference={paymentReference}
      />
    </div>
  )
}
