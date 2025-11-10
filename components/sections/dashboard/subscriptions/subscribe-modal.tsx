"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { subscribe } from "@/store/slices/subscriptionsSlice"
import { useAuth } from "@/hooks/useAuth"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface SubscribeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mentorId: string
  mentorProfileId: string
  mentorName: string
  rates: {
    daily: number
    weekly: number
    monthly: number
  }
}

export function SubscribeModal({
  open,
  onOpenChange,
  mentorId,
  mentorProfileId,
  mentorName,
  rates,
}: SubscribeModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<"daily" | "weekly" | "monthly" | null>(null)
  const dispatch = useDispatch() as AppDispatch
  const { token } = useAuth()
  const { loading } = useSelector((state: RootState) => state.subscriptions)

  const durations = [
    { key: "daily", label: "Daily (24 hours)", cost: rates.daily },
    { key: "weekly", label: "Weekly (7 days)", cost: rates.weekly },
    { key: "monthly", label: "Monthly (30 days)", cost: rates.monthly },
  ]

  const handleSubscribe = async () => {
    if (selectedDuration && token) {
      await dispatch(
        subscribe({
          token,
          mentorProfileId,
          duration: selectedDuration,
        }),
      )
      onOpenChange(false)
      setSelectedDuration(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to {mentorName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Choose a subscription duration to get access to mentorship</p>

          <div className="space-y-2">
            {durations.map((duration) => (
              <Card
                key={duration.key}
                className={`p-4 cursor-pointer transition-all ${
                  selectedDuration === duration.key
                    ? "border-primary bg-primary/5 ring-2 ring-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedDuration(duration.key as any)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{duration.label}</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">{duration.cost} pts</Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="pt-4 flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" disabled={!selectedDuration || loading} onClick={handleSubscribe}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Subscribing..." : "Confirm Subscription"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
