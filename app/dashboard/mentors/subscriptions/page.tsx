"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchMentorSubscriptions } from "@/store/slices/subscriptionsSlice"
import { useAuth } from "@/hooks/useAuth"
import { Calendar, Clock, Loader2, AlertCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

export default function MentorSubscriptionsPage() {
  const dispatch = useDispatch() as AppDispatch
  const { token } = useAuth()
  const { mentorSubscriptions, loading, pagination } = useSelector((state: RootState) => state.subscriptions)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (token) {
      dispatch(fetchMentorSubscriptions({ token, page: currentPage }))
    }
  }, [dispatch, token, currentPage])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/20 text-primary"
      case "expired":
        return "bg-destructive/20 text-destructive"
      case "pending":
        return "bg-yellow-500/20 text-yellow-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getDurationLabel = (duration: string) => {
    const labels: Record<string, string> = {
      daily: "24 hours",
      weekly: "7 days",
      monthly: "30 days",
    }
    return labels[duration] || duration
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="mentors" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="My Students" subtitle="View students currently subscribed to your mentorship" />

        <div className="p-6 space-y-6 max-w-4xl">
          {loading && !mentorSubscriptions.length ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : mentorSubscriptions.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Active Students</h3>
              <p className="text-muted-foreground">
                You don't have any active student subscriptions yet. Once students subscribe to your mentorship, they
                will appear here.
              </p>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {mentorSubscriptions.map((subscription) => (
                  <Card key={subscription.id} className="p-6 hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 flex-1">
                        {/* Student Avatar */}
                        <div className="h-16 w-16 rounded-full bg-linear-to-br from-primary to-accent shrink-0 overflow-hidden">
                          {subscription.student?.avatar_url ? (
                            <img
                              src={subscription.student.avatar_url || "/placeholder.svg"}
                              alt={subscription.student.first_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-white font-bold">
                              {subscription.student?.first_name?.[0]}
                              {subscription.student?.last_name?.[0]}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">
                                {subscription.student?.first_name} {subscription.student?.last_name}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                <Mail className="h-4 w-4" />
                                {subscription.student?.email}
                              </p>
                            </div>
                            <Badge className={getStatusColor(subscription.status)}>
                              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">{subscription.student?.school}</p>

                          {/* Duration and Dates */}
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{getDurationLabel(subscription.duration)} subscription</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(subscription.start_date).toLocaleDateString()} -
                                {new Date(subscription.end_date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-accent">+{subscription.points_cost} pts earned</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                    {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} students
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      disabled={currentPage === pagination.totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
