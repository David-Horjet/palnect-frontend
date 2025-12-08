"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchPayoutSettings, updatePayoutSettings } from "@/store/slices/payoutSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/useAuth"

export function PayoutSettingsForm() {
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useAuth()
  const { conversionRate, minPayoutPoints, maxPayoutPoints, isPayoutEnabled, loading } = useSelector(
    (state: RootState) => state.payout,
  )

  const [formData, setFormData] = useState({
    points_to_naira_rate: conversionRate,
    min_payout_points: minPayoutPoints,
    max_payout_points: maxPayoutPoints,
    is_payout_enabled: isPayoutEnabled,
  })

  useEffect(() => {
    if (token) {
      dispatch(fetchPayoutSettings({ token }))
    }
  }, [token, dispatch])

  useEffect(() => {
    setFormData({
      points_to_naira_rate: conversionRate,
      min_payout_points: minPayoutPoints,
      max_payout_points: maxPayoutPoints,
      is_payout_enabled: isPayoutEnabled,
    })
  }, [conversionRate, minPayoutPoints, maxPayoutPoints, isPayoutEnabled])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number.parseFloat(value) || value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    await dispatch(
      updatePayoutSettings({
        token,
        settings: formData,
      }),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Conversion Rate (Points to Naira)</label>
              <Input
                type="number"
                step="0.01"
                name="points_to_naira_rate"
                value={formData.points_to_naira_rate}
                onChange={handleInputChange}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">How many naira per point</p>
            </div>

            <div>
              <label className="text-sm font-medium">Minimum Payout (Points)</label>
              <Input
                type="number"
                step="100"
                name="min_payout_points"
                value={formData.min_payout_points}
                onChange={handleInputChange}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                ₦{(formData.min_payout_points * formData.points_to_naira_rate).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Maximum Payout (Points)</label>
              <Input
                type="number"
                step="100"
                name="max_payout_points"
                value={formData.max_payout_points}
                onChange={handleInputChange}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                ₦{(formData.max_payout_points * formData.points_to_naira_rate).toLocaleString()}
              </p>
            </div>

            <div className="flex items-end">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_payout_enabled"
                  name="is_payout_enabled"
                  checked={formData.is_payout_enabled}
                //   onCheckedChange={(checked) =>
                //     setFormData((prev) => ({ ...prev, is_payout_enabled: checked as boolean }))
                //   }
                />
                <label htmlFor="is_payout_enabled" className="text-sm font-medium cursor-pointer">
                  Enable Payouts
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
