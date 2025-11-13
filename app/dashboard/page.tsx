"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, BookOpen, Zap, Upload, Gift, Clock, GraduationCap } from "lucide-react"
import Link from "next/link"
import { fetchBalance } from "@/store/slices/pointsSlice"
import { fetchStudentSubscriptions } from "@/store/slices/subscriptionsSlice"
import { listResources } from "@/store/slices/resourcesSlice"
import { fetchMentors } from "@/store/slices/mentorsSlice"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { ActivityFeed } from "@/components/sections/activity-feed"
import { StatCard } from "@/components/shared/stat-card"

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(true)

  const { user } = useSelector((state: RootState) => state.auth)

  const pointsBalance = useSelector((state: RootState) => state.points.balance)
  const pointsLoading = useSelector((state: RootState) => state.points.loading)

  const studentSubscriptions = useSelector((state: RootState) => state.subscriptions.studentSubscriptions)
  const subscriptionsLoading = useSelector((state: RootState) => state.subscriptions.loading)

  const mentors = useSelector((state: RootState) => state.mentors.mentors)
  console.log("mentors:", mentors)
  const mentorsLoading = useSelector((state: RootState) => state.mentors.loading)

  const resources = useSelector((state: RootState) => state.resources.resources)
  const resourcesLoading = useSelector((state: RootState) => state.resources.loading)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const loadDashboardData = async () => {
      setIsLoading(true)
      try {
        await Promise.all([
          dispatch(fetchBalance({ token })),
          dispatch(fetchStudentSubscriptions({ token, page: 1, limit: 5 })),
          dispatch(listResources({ page: 1, limit: 3 })),
          dispatch(fetchMentors({ token, page: 1, limit: 2 })),
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [dispatch])

  const getStatValue = (label: string): string => {
    if (label === "Resources Completed" && resources.length > 0) {
      return resources.length.toString()
    }
    if (label === "Mentors Connected" && studentSubscriptions.length > 0) {
      return studentSubscriptions.length.toString()
    }
    return "0"
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="home" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="Welcome back!" subtitle="Continue your learning journey with Palnect" />

        <div className="p-6 space-y-8">
          {/* Welcome Banner */}
          <Card className="bg-linear-to-r from-primary/20 via-accent/20 to-primary/10 border-primary/30 p-[15px] md:p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-base md:text-lg lg:text-2xl font-bold text-foreground mb-2">Get started with Palnect</h2>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">
                  Upload resources, find mentors, and earn points to grow your academic network.
                </p>
                {/* <div className="flex flex-wrap gap-3">
                  <Button variant="primary" size="sm">
                    <Link href="/dashboard/points">
                      <Gift className="h-4 w-4 mr-2" />
                      Claim 10 Welcome Points
                    </Link>
                  </Button>
                  <Button variant="secondary" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Take Platform Tour
                  </Button>
                </div> */}
              </div>
              <div className="text-foreground/50"><GraduationCap size={30} /></div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-5 justify-center flex-col items-start hover:bg-primary/5 bg-transparent"

              >
                <Link className="flex items-center justify-center gap-2" href="/dashboard/resources/upload">
                  <Upload className="h-5 w-5" />
                  <div className="flex flex-col gap-1 items-start">
                    <span className="font-semibold">Upload Resource</span>
                    <span className="text-xs text-muted-foreground">Share notes with peers</span>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-5 justify-center flex-col items-start hover:bg-accent/5 bg-transparent"

              >
                <Link className="flex items-center justify-center gap-2" href="/dashboard/mentors">
                  <Users className="h-5 w-5" />
                  <div className="flex flex-col gap-1 items-start">
                    <span className="font-semibold">Find Mentor</span>
                    <span className="text-xs text-muted-foreground">Get expert guidance</span>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-5 justify-center flex-col items-start hover:bg-primary/5 bg-transparent"

              >
                <Link className="flex items-center justify-center gap-2" href="/dashboard/points">
                  <Zap className="h-5 w-5" />
                  <div className="flex flex-col gap-1 items-start">
                    <span className="font-semibold">Buy Points</span>
                    <span className="text-xs text-muted-foreground">Get credits for services</span>
                  </div>
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <StatCard
              label="Resources Completed"
              value={getStatValue("Resources Completed")}
              change={resources.length > 0 ? `+${resources.length} available` : "No resources yet"}
              trend="up"
              icon={<BookOpen className="h-8 w-8" />}
            />
            <StatCard
              label="Learning Streak"
              value="7 days"
              change="Keep it up!"
              trend="neutral"
              icon={<TrendingUp className="h-8 w-8" />}
            />
            <StatCard
              label="Mentors Connected"
              value={studentSubscriptions.length.toString()}
              change={studentSubscriptions.length > 0 ? `${studentSubscriptions.length} active` : "No mentors yet"}
              trend="up"
              icon={<Users className="h-8 w-8" />}
            />
            <StatCard
              label="Points Balance"
              value={pointsBalance.toString()}
              change={pointsBalance > 0 ? "Ready to use" : "Buy more points"}
              trend={pointsBalance > 0 ? "up" : "neutral"}
              icon={<Zap className="h-8 w-8" />}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Activity Feed */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Recent Activity</h2>
                  <Link href="/dashboard/activity" className="text-sm text-primary hover:text-primary/80">
                    View All
                  </Link>
                </div>
                <ActivityFeed />
              </div>

              {/* Recent Resources */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Recent Resources</h2>
                  <Link href="/dashboard/resources" className="text-sm text-primary hover:text-primary/80">
                    View All
                  </Link>
                </div>
                {resourcesLoading ? (
                  <Card className="p-8 text-center text-muted-foreground">Loading resources...</Card>
                ) : resources.length > 0 ? (
                  <div className="space-y-3">
                    {resources.slice(0, 3).map((resource: any) => (
                      <Card key={resource.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <Link href={`/dashboard/resources/${resource.id}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">{resource.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                by {resource.uploaded_by || "Unknown"} • {resource.download_count || 0} downloads •{" "}
                                {new Date(resource.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="secondary">{resource.category}</Badge>
                          </div>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    No resources available. Start by exploring or uploading resources.
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recommended Mentors */}
              <div>
                <h3 className="font-bold mb-4">Recommended Mentors</h3>
                {mentorsLoading ? (
                  <Card className="p-4 text-center text-muted-foreground text-sm">Loading mentors...</Card>
                ) : mentors.length > 0 ? (
                  <div className="space-y-3">
                    {mentors.slice(0, 2).map((mentor: any) => (
                      <Card key={mentor.id} className="hover:shadow-md transition-shadow">
                        <Link href={`/dashboard/mentors/${mentor.id}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-sm">
                                {mentor?.user?.first_name || "Unknown"}{" "}
                                {mentor?.user?.last_name || ""}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {mentor?.expertise?.slice(0, 2).join(", ") || "Expert"}
                              </p>
                            </div>
                            <Badge className="text-xs">View</Badge>
                          </div>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-4 text-center text-muted-foreground text-sm">No mentors available yet</Card>
                )}
              </div>

              {/* Points Widget */}
              <Card className="bg-linear-to-br from-primary/10 to-accent/10 border-primary/20 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Your Points Balance</p>
                    <p className="text-3xl font-bold text-foreground">{pointsLoading ? "..." : pointsBalance}</p>
                  </div>
                  <Zap className="h-8 w-8 text-primary opacity-50" />
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Use points to subscribe to mentors and unlock premium resources
                </p>
                <Button size="sm" className="w-full">
                  <Link href="/dashboard/points">Buy More Points</Link>
                </Button>
              </Card>

              {/* Active Subscriptions */}
              <Card>
                <h3 className="font-bold mb-4">Active Subscriptions</h3>
                {subscriptionsLoading ? (
                  <div className="text-center text-muted-foreground text-sm py-4">Loading...</div>
                ) : studentSubscriptions.length > 0 ? (
                  <div className="space-y-3">
                    {studentSubscriptions.slice(0, 2).map((sub: any) => {
                      const daysLeft = Math.ceil(
                        (new Date(sub.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      )
                      return (
                        <Link
                          key={sub.id}
                          href={`/dashboard/mentors/${sub.mentor_profile?.id}`}
                          className="p-3 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors block"
                        >
                          <p className="font-semibold text-sm text-foreground">
                            {sub.mentor?.first_name} {sub.mentor?.last_name}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground capitalize">
                              {sub.duration} subscription
                            </span>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {daysLeft} days
                            </Badge>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground text-sm py-4">
                    No active subscriptions. Find a mentor to get started.
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
