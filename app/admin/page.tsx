"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAdminStats } from "@/store/slices/adminSlice"
import type { AppDispatch, RootState } from "@/store/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { stats, loading } = useSelector((state: RootState) => state.admin)

  useEffect(() => {
    dispatch(getAdminStats())
  }, [dispatch])

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: "👥",
      color: "text-blue-500",
    },
    {
      title: "Total Resources",
      value: stats?.totalResources || 0,
      icon: "📚",
      color: "text-green-500",
    },
    {
      title: "Total Mentors",
      value: stats?.totalMentors || 0,
      icon: "🎓",
      color: "text-purple-500",
    },
    {
      title: "Active Subscriptions",
      value: stats?.activeSubscriptions || 0,
      icon: "✨",
      color: "text-orange-500",
    },
    {
      title: "Total Transactions",
      value: stats?.totalTransactions || 0,
      icon: "💳",
      color: "text-pink-500",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Platform statistics and overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading
          ? Array(5)
              .fill(null)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-12" />
                  </CardContent>
                </Card>
              ))
          : statCards.map((stat, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/mentors" className="block p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <div className="font-medium text-foreground">Manage Mentors</div>
              <div className="text-sm text-muted-foreground">Review and approve pending applications</div>
            </Link>
            <Link href="/admin/points" className="block p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <div className="font-medium text-foreground">Manage Points</div>
              <div className="text-sm text-muted-foreground">Credit or debit user points</div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Platform Status</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Users</span>
              <span className="text-sm font-medium text-foreground">{stats?.totalUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Mentors</span>
              <span className="text-sm font-medium text-foreground">{stats?.totalMentors || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
