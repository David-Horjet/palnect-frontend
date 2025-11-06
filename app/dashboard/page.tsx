"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, BookOpen, Award } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { ActivityFeed } from "@/components/sections/activity-feed"
import { StatCard } from "@/components/shared/stat-card"

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar activeTab="home" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <DashboardHeader title="Welcome back, Alex!" subtitle="Here's your learning progress this week" />

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <StatCard
              label="Resources Completed"
              value="12"
              change="+2 this week"
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
              value="3"
              change="1 new this month"
              trend="up"
              icon={<Users className="h-8 w-8" />}
            />
            <StatCard label="Achievements" value="8" change="2 new" trend="up" icon={<Award className="h-8 w-8" />} />
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Continue Learning */}
              <div>
                <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">React Advanced Patterns</h3>
                      <p className="text-sm text-muted-foreground mb-3">Module 3 of 5</p>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }} />
                      </div>
                    </div>
                    <Button variant="primary" size="sm">
                      Continue
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Recent Activity</h2>
                  <Link href="/dashboard/activity" className="text-sm text-primary hover:text-primary/80">
                    View All
                  </Link>
                </div>
                <ActivityFeed />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recommended Mentors */}
              <div>
                <h3 className="font-bold mb-4">Recommended Mentors</h3>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Chen", role: "React Expert", match: "95%" },
                    { name: "Alex Rodriguez", role: "Full Stack", match: "88%" },
                  ].map((mentor, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm">{mentor.name}</p>
                          <p className="text-xs text-muted-foreground">{mentor.role}</p>
                        </div>
                        <Badge className="text-xs">{mentor.match}</Badge>
                      </div>
                      <Button variant="secondary" size="sm" className="w-full mt-3">
                        View Profile
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div>
                <h3 className="font-bold mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {[
                    { title: "React Workshop", date: "Mar 15, 2:00 PM" },
                    { title: "Community Meetup", date: "Mar 20, 6:00 PM" },
                  ].map((event, i) => (
                    <Card key={i} className="p-4">
                      <p className="font-semibold text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
