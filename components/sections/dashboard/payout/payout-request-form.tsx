"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { requestPayout, getConversionRate, fetchPayoutHistory } from "@/store/slices/payoutSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"

const MINIMUM_NAIRA = 1000

export function PayoutRequestForm() {
  const dispatch = useDispatch<AppDispatch>()
  const { accountDetails, loading, conversionRate } = useSelector((state: RootState) => state.payout)
  const { token } = useSelector((state: RootState) => state.auth)
  const { balance } = useSelector((state: RootState) => state.points)

  const [amountPoints, setAmountPoints] = useState("")
  const [amountNaira, setAmountNaira] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (token) {
      dispatch(getConversionRate({ token }))
    }
  }, [dispatch, token])

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = Number.parseFloat(e.target.value) || 0
    setAmountPoints(e.target.value)

    const naira = points * conversionRate
    setAmountNaira(naira.toFixed(2))
    validateAmount(points, naira)
  }

  const handleNairaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const naira = Number.parseFloat(e.target.value) || 0
    setAmountNaira(e.target.value)

    const points = naira / conversionRate
    setAmountPoints(points.toFixed(0))
    validateAmount(points, naira)
  }

  const validateAmount = (points: number, naira: number) => {
    setError("")

    if (naira < MINIMUM_NAIRA) {
      setError(
        `Minimum payout is ₦${MINIMUM_NAIRA}. You need at least ${Math.ceil(MINIMUM_NAIRA / conversionRate)} points.`,
      )
      return
    }

    if (points > balance) {
      setError(`You don't have enough points. You have ${balance} points.`)
      return
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const points = Number.parseInt(amountPoints)
    const naira = Number.parseFloat(amountNaira)

    validateAmount(points, naira)

    if (error || !token) return

    const result = await dispatch(requestPayout({ token, amount_points: points, amount_naira: naira }))

    if (result.meta.requestStatus === "fulfilled") {
      setAmountPoints("")
      setAmountNaira("")
      dispatch(fetchPayoutHistory({ token }))
    }
  }

  const isDisabled = !accountDetails || loading || !!error || !amountPoints || !amountNaira

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Request Payout</h2>

      {!accountDetails && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Please save your bank account details above before requesting a payout.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Amount in Points</label>
          <div className="relative">
            <Input
              type="number"
              value={amountPoints}
              onChange={handlePointsChange}
              placeholder="Enter amount in points"
              disabled={!accountDetails || loading}
              className="pr-24"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Points</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">You have {balance} points available</p>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Amount in Naira (₦)</label>
          <div className="relative">
            <Input
              type="number"
              value={amountNaira}
              onChange={handleNairaChange}
              placeholder="Amount will be calculated"
              disabled={!accountDetails || loading}
              step="100"
              className="pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₦</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Conversion rate: 1 point = ₦{conversionRate.toFixed(4)}</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 flex gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <Button type="submit" disabled={isDisabled} className="w-full">
          {loading ? "Processing..." : "Request Payout"}
        </Button>
      </form>
    </div>
  )
}
