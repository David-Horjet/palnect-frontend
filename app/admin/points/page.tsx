"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { creditPoints, debitPoints } from "@/store/slices/adminSlice"
import type { AppDispatch, RootState } from "@/store/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/shared/form-field"

export default function AdminPointsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.admin)
  const [activeTab, setActiveTab] = useState<"credit" | "debit">("credit")
  const [formData, setFormData] = useState({
    userId: "",
    amount: "",
    description: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userId || !formData.amount || !formData.description) {
      return
    }

    setSubmitting(true)
    const amount = Number.parseInt(formData.amount)

    const thunk = activeTab === "credit" ? creditPoints : debitPoints
    const result = await dispatch(
      thunk({
        userId: formData.userId,
        amount,
        description: formData.description,
      }),
    )

    if (result.type === (activeTab === "credit" ? creditPoints.fulfilled.type : debitPoints.fulfilled.type)) {
      setFormData({ userId: "", amount: "", description: "" })
    }
    setSubmitting(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Points Management</h1>
        <p className="text-muted-foreground">Manually credit or debit user points</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-green-500">+</span>
              Credit Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="User ID"
                name="userId"
                placeholder="Enter user UUID"
                value={formData.userId}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="1"
                required
              />
              <FormField
                label="Description"
                name="description"
                placeholder="Reason for crediting points"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <Button
                type="submit"
                onClick={() => setActiveTab("credit")}
                disabled={submitting || loading}
                className="w-full"
              >
                {submitting ? "Processing..." : "Credit Points"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-red-500">-</span>
              Debit Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="User ID"
                name="userId"
                placeholder="Enter user UUID"
                value={formData.userId}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="1"
                required
              />
              <FormField
                label="Description"
                name="description"
                placeholder="Reason for debiting points"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <Button
                type="submit"
                onClick={() => setActiveTab("debit")}
                variant="destructive"
                disabled={submitting || loading}
                className="w-full"
              >
                {submitting ? "Processing..." : "Debit Points"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Credit Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Award users points for various contributions such as community participation, achievements, or special
              programs.
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Debit Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Deduct points from users for policy violations, penalties, or point adjustments due to refunds or
              cancellations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
