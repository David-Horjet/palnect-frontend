"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { saveAccountDetails, getAccountDetails } from "@/store/slices/payoutSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AccountDetailsForm() {
  const dispatch = useDispatch<AppDispatch>()
  const { accountDetails, loading } = useSelector((state: RootState) => state.payout)
  const { token } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    bank_name: "",
    account_number: "",
    account_holder_name: "",
  })

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (token) {
      dispatch(getAccountDetails({ token }))
    }
  }, [dispatch, token])

  useEffect(() => {
    if (accountDetails) {
      setFormData({
        bank_name: accountDetails.bank_name,
        account_number: accountDetails.account_number,
        account_holder_name: accountDetails.account_holder_name,
      })
      setIsEditing(false)
    }
  }, [accountDetails])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    await dispatch(saveAccountDetails({ token, details: formData }))
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Bank Account Details</h2>
        {accountDetails && !isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {!accountDetails ? (
        <p className="text-sm text-muted-foreground mb-4">
          Please save your bank account details before requesting a payout.
        </p>
      ) : !isEditing ? (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Bank Name</p>
            <p className="text-sm font-medium text-foreground">{formData.bank_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Account Number</p>
            <p className="text-sm font-medium text-foreground">{formData.account_number}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Account Holder Name</p>
            <p className="text-sm font-medium text-foreground">{formData.account_holder_name}</p>
          </div>
        </div>
      ) : null}

      {isEditing || !accountDetails ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Bank Name</label>
            <Input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              placeholder="e.g., GTBank, Access Bank"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Account Number</label>
            <Input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              placeholder="Enter your account number"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Account Holder Name</label>
            <Input
              type="text"
              name="account_holder_name"
              value={formData.account_holder_name}
              onChange={handleChange}
              placeholder="Enter name as it appears on bank"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save Account Details"}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      ) : null}
    </div>
  )
}
