"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, BookOpen, Award, Gift, Upload, Zap } from "lucide-react"
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
        <DashboardHeader title="Welcome back!" subtitle="Continue your learning journey with Palnect" />

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Welcome Banner */}
          <Card className="bg-linear-to-r from-primary/20 via-accent/20 to-primary/10 border-primary/30 p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">Get started with Palnect</h2>
                <p className="text-muted-foreground mb-4">
                  Upload resources, find mentors, and earn points to grow your academic network.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" size="sm">
                    <Gift className="h-4 w-4 mr-2" />
                    Claim 10 Welcome Points
                  </Button>
                  <Button variant="secondary" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Take Platform Tour
                  </Button>
                </div>
              </div>
              <div className="text-4xl opacity-20">🎓</div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 justify-start flex-col items-start hover:bg-primary/5 bg-transparent"
                
              >
                <Link href="/dashboard/resources/upload">
                  <Upload className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Upload Resource</span>
                  <span className="text-xs text-muted-foreground">Share notes with peers</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 justify-start flex-col items-start hover:bg-accent/5 bg-transparent"
                
              >
                <Link href="/dashboard/mentors">
                  <Users className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Find Mentor</span>
                  <span className="text-xs text-muted-foreground">Get expert guidance</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 justify-start flex-col items-start hover:bg-primary/5 bg-transparent"
                
              >
                <Link href="/dashboard/points">
                  <Zap className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Buy Points</span>
                  <span className="text-xs text-muted-foreground">Get credits for services</span>
                </Link>
              </Button>
            </div>
          </div>

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

              {/* Recent Resources */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Recent Resources</h2>
                  <Link href="/dashboard/resources" className="text-sm text-primary hover:text-primary/80">
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      title: "Physics Lecture Notes - Chapter 5",
                      uploader: "Sarah Chen",
                      downloads: 342,
                      date: "2 days ago",
                    },
                    {
                      title: "Calculus Past Questions 2023",
                      uploader: "Marcus Johnson",
                      downloads: 521,
                      date: "5 days ago",
                    },
                    {
                      title: "Biology Study Guide - Cell Division",
                      uploader: "Emma Thompson",
                      downloads: 218,
                      date: "1 week ago",
                    },
                  ].map((resource, i) => (
                    <Card key={i} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{resource.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            by {resource.uploader} • {resource.downloads} downloads • {resource.date}
                          </p>
                        </div>
                        <Button variant="secondary" size="sm">
                          Download
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
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

              {/* Points Widget */}
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Your Points Balance</p>
                    <p className="text-3xl font-bold text-foreground">420</p>
                  </div>
                  <Zap className="h-8 w-8 text-primary opacity-50" />
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Use points to subscribe to mentors and unlock premium resources
                </p>
                <Button size="sm" className="w-full">
                  Buy More Points
                </Button>
              </Card>

              {/* Active Subscriptions */}
              <Card>
                <h3 className="font-bold mb-4">Active Subscriptions</h3>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Chen", type: "Weekly Mentorship", expires: "3 days" },
                    { name: "Alex Rodriguez", type: "Daily Support", expires: "12 hours" },
                  ].map((sub, i) => (
                    <div
                      key={i}
                      className="p-3 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors"
                    >
                      <p className="font-semibold text-sm text-foreground">{sub.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{sub.type}</span>
                        <Badge variant="outline" className="text-xs">
                          {sub.expires}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Suggested Mentors */}
              <Card>
                <h3 className="font-bold mb-4">Suggested Mentors</h3>
                <div className="space-y-3">
                  {[
                    { name: "Dr. Priya Sharma", role: "Mathematics Expert", match: "95%" },
                    { name: "James Wilson", role: "Biology Specialist", match: "88%" },
                  ].map((mentor, i) => (
                    <div
                      key={i}
                      className="p-3 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-sm text-foreground">{mentor.name}</p>
                          <p className="text-xs text-muted-foreground">{mentor.role}</p>
                        </div>
                        <Badge className="text-xs">{mentor.match}</Badge>
                      </div>
                      <Button variant="secondary" size="sm" className="w-full text-xs">
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
