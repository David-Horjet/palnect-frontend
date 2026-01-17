"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, BookOpen, Zap, Upload, Gift, Clock, GraduationCap, File } from "lucide-react"
import Link from "next/link"
import { fetchBalance } from "@/store/slices/pointsSlice"
import { fetchStudentSubscriptions } from "@/store/slices/subscriptionsSlice"
import { listResources } from "@/store/slices/resourcesSlice"
import { fetchMentors } from "@/store/slices/mentorsSlice"
import { fetchUserStreak } from "@/store/slices/streakSlice"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { ActivityFeed } from "@/components/sections/activity-feed"
import Image from "next/image"
import { StatCard } from "@/components/shared/stat-card"

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(true)

  const { user } = useSelector((state: RootState) => state.auth)

  const pointsBalance = useSelector((state: RootState) => state.points.balance)
  const pointsLoading = useSelector((state: RootState) => state.points.loading)

  const studentSubscriptions = useSelector((state: RootState) => state.subscriptions.studentSubscriptions)
  console.log("studentSubscriptions: ", studentSubscriptions)
  const subscriptionsLoading = useSelector((state: RootState) => state.subscriptions.loading)

  const mentors = useSelector((state: RootState) => state.mentors.mentors)
  console.log("mentors:", mentors)
  const mentorsLoading = useSelector((state: RootState) => state.mentors.loading)

  const streak = useSelector((state: RootState) => state.streak.streak)
  const streakLoading = useSelector((state: RootState) => state.streak.loading)

  const { resources, myResources } = useSelector((state: RootState) => state.resources)
  console.log("resources:", resources)
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
          dispatch(fetchUserStreak()),
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [dispatch])

  const getStatValue = (label: string): string => {
    if (label === "Resources Uploaded" && myResources.length > 0) {
      return myResources.length.toString()
    }
    if (label === "Mentors Connected" && studentSubscriptions.length > 0) {
      return studentSubscriptions.length.toString()
    }
    if (label === "Learning Streak" && streak) {
      return `${streak.current_streak} day${streak.current_streak !== 1 ? 's' : ''}`
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
                  Upload resources, find mentors, and earn credits to grow your academic network.
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
            <h3 className="text-base md:text-lg font-bold mb-4">Quick Actions</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto justify-start flex-col items-start hover:bg-primary/5 bg-transparent"

              >
                <Link className="w-full flex items-center justify-start gap-2" href="/dashboard/resources/upload">
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
                <Link className="w-full flex items-center justify-start gap-2" href="/dashboard/mentors">
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
                <Link className="w-full flex items-center justify-start gap-2" href="/dashboard/credits">
                  <Zap className="h-5 w-5" />
                  <div className="flex flex-col gap-1 items-start">
                    <span className="font-semibold">Buy Credits</span>
                    <span className="text-xs text-muted-foreground">Get credits for services</span>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-5 justify-center flex-col items-start hover:bg-accent/5 bg-transparent"

              >
                <Link className="w-full flex items-center justify-start gap-2" href="/dashboard/tools">
                  <GraduationCap className="h-5 w-5" />
                  <div className="flex flex-col gap-1 items-start">
                    <span className="font-semibold">Tools</span>
                    <span className="text-xs text-muted-foreground">Academic calculators & utilities</span>
                  </div>
                </Link>
              </Button> 
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <StatCard
              label="Resources Uploaded"
              value={getStatValue("Resources Uploaded")}
              change={myResources.length > 0 ? `+${myResources.length} available` : "No resource uploaded yet"}
              trend="up"
              icon={<BookOpen className="h-5 w-5" />}
            />
            <StatCard 
              label="Learning Streak"
              value={getStatValue("Learning Streak")}
              change={
                streak
                  ? streak.current_streak > 0
                    ? `Longest: ${streak.longest_streak} day(s)`
                    : "Start your learning journey!"
                  : "Loading..."
              }
              trend={streak && streak.current_streak > 0 ? "up" : "neutral"}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <StatCard
              label="Mentors Connected"
              value={studentSubscriptions.length.toString()}
              change={
                studentSubscriptions.filter(
                  (sub) => sub.status === "active"
                ).length > 0
                  ? `${studentSubscriptions.filter(
                    (sub) => sub.status === "active"
                  ).length} active`
                  : "No active mentors"
              }
              trend="up"
              icon={<Users className="h-5 w-5" />}
            />
            <StatCard
              label="Credits Balance"
              value={pointsBalance.toString()}
              change={pointsBalance > 0 ? "Ready to use" : "Buy more credits"}
              trend={pointsBalance > 0 ? "up" : "neutral"}
              icon={<Zap className="h-5 w-5" />}
            />
          </div>

          {/* Two Column Layout */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="w-full col-span-1 lg:col-span-2 space-y-6">
              {/* Activity Feed */}
              {/* <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base md:text-lg font-bold">Recent Activity</h2>
                  <Link href="/dashboard/activity" className="text-sm text-primary hover:text-primary/80">
                    View All
                  </Link>
                </div>
                <ActivityFeed />
              </div> */}

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
                      <Card key={resource.id} className="p-2 md:p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <Link href={`/dashboard/resources/${resource.id}`}>
                          <div className="flex items-center gap-4">
                            <div className="">
                              <File className="h-12 w-9 md:h-16 md:w-12" />
                            </div>
                            <div className="w-full flex flex-col items-start justify-between">
                              <div className="mb-2">
                                <h3 className="text-sm md:text-base font-semibold text-foreground mb-1">{resource.title}</h3>
                                <p className="text-xs text-muted-foreground">
                                  by {resource.uploader.first_name || "Unknown"} • {resource.downloads || 0} downloads •{" "}
                                  {new Date(resource.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge className="text-[10px]" variant="secondary">{resource.category}</Badge>
                            </div>
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
                          <div className="flex items-center gap-2">
                            <div className="shrink-0">
                              {mentor?.user?.avatar_url ? (
                                <Image
                                  src={mentor?.user?.avatar_url || "/placeholder.svg"}
                                  alt="Avatar"
                                  className="h-10 w-10 rounded-full object-cover"
                                  width={96}
                                  height={96}
                                />
                              ) : (
                                <div className="h-15 md:h-24 w-15 md:w-24 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
                                  {mentor?.user?.first_name[0]}
                                  {mentor?.user?.last_name[0]}
                                </div>
                              )}
                            </div>
                            <div className="w-full flex items-start justify-between gap-3">
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
                    <p className="text-sm text-muted-foreground mb-1">Your Credits Balance</p>
                    <p className="text-3xl font-bold text-foreground">{pointsLoading ? "..." : pointsBalance}</p>
                  </div>
                  <Zap className="h-8 w-8 text-primary opacity-50" />
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Use credits to subscribe to mentors and unlock premium resources
                </p>
                <Button size="sm" className="w-full">
                  <Link href="/dashboard/credits">Buy More Credits</Link>
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
                          href={`/dashboard/mentors/${sub.mentor_profile_id}`}
                          className={`p-3 bg-muted/10 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors ${sub.status === "active" ? "block" : "hidden"}`}
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
