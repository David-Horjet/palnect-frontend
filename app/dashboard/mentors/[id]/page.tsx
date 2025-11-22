"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { use, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchMentorDetail } from "@/store/slices/mentorsSlice"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import { ArrowLeft, Star, Users, Clock, Calendar, Loader2 } from "lucide-react"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { SubscribeModal } from "@/components/sections/dashboard/subscriptions/subscribe-modal"
import Image from "next/image"

export default function MentorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  const dispatch = useDispatch() as AppDispatch
  const { token } = useAuth()
  const { selectedMentor: mentor, loading } = useSelector((state: RootState) => state.mentors)
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)

  useEffect(() => {
    if (token) {
      dispatch(fetchMentorDetail({ token, id: id }))
    }
  }, [dispatch, token, id])

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
        {/* Header with Back Button */}
        <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="px-6 py-4">
            <Link
              href="/dashboard/mentors"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Mentors
            </Link>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Hero Section */}
          <Card className="bg-linear-to-br from-primary/10 to-accent/10">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2">
                {/* Avatar and Name */}
                <div className="flex gap-4 mb-6">
                  <div className="h-24 w-24 rounded-full bg-linear-to-br from-primary to-accent shrink-0 overflow-hidden">
                    {mentor.user.avatar_url ? (
                      <Image
                        src={mentor.user.avatar_url || "/placeholder.svg"}
                        alt={mentor.user.first_name}
                        className="h-full w-full object-cover"
                        width={96}
                        height={96}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white font-bold text-lg md:text-xl">
                        {mentor.user.first_name[0]}
                        {mentor.user.last_name[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">
                      {mentor.user.first_name} {mentor.user.last_name}
                    </h1>
                    <p className="text-muted-foreground mb-3">
                      {mentor.user.school} • {mentor.user.department || "Student"}
                    </p>
                    <div className="flex gap-4 text-sm">
                      {mentor.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="font-semibold">{mentor.rating.toFixed(1)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{mentor.total_students} students</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <p className="text-muted-foreground text-xs md:text-sm">{mentor.bio}</p>
              </div>

              {/* Subscription Card */}
              <Card className="h-fit">
                <div className="space-y-3 text-xs md:text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Available now</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{mentor.is_approved ? "Verified" : "Pending Approval"}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 p-3 bg-muted/20 rounded-lg">
                  <p className="text-xs font-semibold text-foreground">Subscription Rates (credits)</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Daily: {mentor.daily_rate} pts</p>
                    <p>Weekly: {mentor.weekly_rate} pts</p>
                    <p>Monthly: {mentor.monthly_rate} pts</p>
                  </div>
                </div>

                <Button variant="primary" className="w-full" onClick={() => setShowSubscribeModal(true)}>
                  Subscribe Now
                </Button>
              </Card>
            </div>
          </Card>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <Card>
                <h2 className="text-base md:text-lg font-bold mb-4">About</h2>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{mentor.bio}</p>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Availability */}
              <Card>
                <h3 className="font-bold mb-4">Available Times</h3>
                <div className="space-y-2 text-xs md:text-sm">
                  <p className="font-medium text-foreground">Days</p>
                  <p className="text-muted-foreground">
                    {mentor.availability?.weekdays?.join(", ") || "Not specified"}
                  </p>
                  <p className="font-medium text-foreground mt-3">Hours</p>
                  <p className="text-muted-foreground">{mentor.availability?.hours || "Not specified"}</p>
                </div>
              </Card>

              {/* Info */}
              <Card>
                <h3 className="font-bold mb-4">Information</h3>
                <div className="space-y-3 text-xs md:text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Email</p>
                    <p className="text-foreground">{mentor.user.email}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">School</p>
                    <p className="text-foreground">{mentor.user.school || "-"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Joined</p>
                    <p className="text-foreground">{new Date(mentor.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <SubscribeModal
        open={showSubscribeModal}
        onOpenChange={setShowSubscribeModal}
        mentorId={mentor.id}
        mentorProfileId={mentor.id}
        mentorName={`${mentor.user.first_name} ${mentor.user.last_name}`}
        rates={{
          daily: mentor.daily_rate,
          weekly: mentor.weekly_rate,
          monthly: mentor.monthly_rate,
        }}
      />
    </div>
  )
}
