"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { useAuth } from "@/hooks/useAuth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { MentorUpdateModal } from "@/components/sections/dashboard/mentor/mentor-update-modal"

export default function MentorProfilePage() {
  const dispatch = useDispatch() as AppDispatch
  const { user, token } = useAuth()
  const { selectedMentor: mentor, loading } = useSelector((state: RootState) => state.mentors)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  useEffect(() => {
    if (token && user?.is_mentor) {
      // Fetch the current user's mentor profile
      // In a real scenario, you'd have an endpoint to get current mentor profile
      // For now, we'll fetch by user ID or have a dedicated endpoint
    }
  }, [dispatch, token, user])

  if (!token || !user?.is_mentor) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar activeTab="mentors" />
        <main className="flex-1 overflow-auto">
          <DashboardHeader title="Mentor Profile" />
          <div className="p-6">
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">You are not currently a mentor</p>
              <Button>
                <a href="/dashboard/mentors/apply">Apply to Become a Mentor</a>
              </Button>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (loading || !mentor) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar activeTab="mentors" />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="mentors" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="My Mentor Profile" subtitle="View and manage your mentorship details" />

        <div className="p-6 space-y-6 max-w-4xl">
          {/* Profile Header */}
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {mentor.user.first_name} {mentor.user.last_name}
                </h1>
                <div className="flex gap-2 items-center">
                  <Badge variant={mentor.is_approved ? "secondary" : "outline"}>
                    {mentor.is_approved ? "Verified" : "Pending Approval"}
                  </Badge>
                  {mentor.rating && <Badge variant="outline">Rating: {mentor.rating.toFixed(1)}</Badge>}
                </div>
              </div>
              <Button onClick={() => setIsUpdateModalOpen(true)}>Edit Profile</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-border">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Students</p>
                <p className="text-2xl font-bold text-foreground">{mentor.total_students}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">School</p>
                <p className="text-foreground">{mentor.user.school || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Status</p>
                <p className="text-foreground">{mentor.is_approved ? "Active" : "Awaiting Approval"}</p>
              </div>
            </div>
          </Card>

          {/* Bio */}
          <Card>
            <h2 className="text-lg font-bold mb-4 text-foreground">About</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{mentor.bio}</p>
          </Card>

          {/* Expertise */}
          <Card>
            <h2 className="text-lg font-bold mb-4 text-foreground">Areas of Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise.map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Rates */}
          <Card>
            <h2 className="text-lg font-bold mb-4 text-foreground">Mentorship Rates (Points)</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-muted-foreground mb-2">Daily Rate</p>
                <p className="text-2xl font-bold text-foreground">{mentor.daily_rate}</p>
                <p className="text-xs text-muted-foreground mt-1">pts/day</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-muted-foreground mb-2">Weekly Rate</p>
                <p className="text-2xl font-bold text-foreground">{mentor.weekly_rate}</p>
                <p className="text-xs text-muted-foreground mt-1">pts/week</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-muted-foreground mb-2">Monthly Rate</p>
                <p className="text-2xl font-bold text-foreground">{mentor.monthly_rate}</p>
                <p className="text-xs text-muted-foreground mt-1">pts/month</p>
              </div>
            </div>
          </Card>

          {/* Availability */}
          <Card>
            <h2 className="text-lg font-bold mb-4 text-foreground">Availability</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Days</p>
                <p className="text-foreground">{mentor.availability?.weekdays?.join(", ") || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Hours</p>
                <p className="text-foreground">{mentor.availability?.hours || "Not specified"}</p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <MentorUpdateModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} mentor={mentor} />
    </div>
  )
}
