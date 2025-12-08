"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, AlertCircle, TrendingUp, Settings } from "lucide-react"

interface PayoutStatsProps {
  pendingCount: number
  conversionRate: number
  minPayout: number
  maxPayout: number
  isEnabled: boolean
}

export function PayoutStatsCard({ pendingCount, conversionRate, minPayout, maxPayout, isEnabled }: PayoutStatsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          <AlertCircle className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCount}</div>
          <p className="text-xs text-muted-foreground">Awaiting review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Points to Naira</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payout Range</CardTitle>
          <Zap className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{(minPayout * conversionRate).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Min - ₦{(maxPayout * conversionRate).toLocaleString()} Max</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <Settings className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isEnabled ? "text-success" : "text-destructive"}`}>
            {isEnabled ? "Active" : "Disabled"}
          </div>
          <p className="text-xs text-muted-foreground">System status</p>
        </CardContent>
      </Card>
    </div>
  )
}
