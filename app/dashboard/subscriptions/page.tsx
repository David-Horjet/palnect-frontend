"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchStudentSubscriptions } from "@/store/slices/subscriptionsSlice"
import { useAuth } from "@/hooks/useAuth"
import { Calendar, Clock, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import Link from "next/link"

export default function SubscriptionsPage() {
  const dispatch = useDispatch() as AppDispatch
  const { token } = useAuth()
  const { studentSubscriptions, loading, pagination } = useSelector((state: RootState) => state.subscriptions)
  console.log("studentSubscriptions: ", studentSubscriptions)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<"active" | "expired">("active")

  useEffect(() => {
    if (token) {
      dispatch(fetchStudentSubscriptions({ token, page: currentPage }))
    }
  }, [dispatch, token, currentPage])

  const filteredSubscriptions = studentSubscriptions.filter(
    (sub) => sub.status === statusFilter
  )

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
      <DashboardSidebar activeTab="subscriptions" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="My Subscriptions" subtitle="Manage your active and expired mentor subscriptions" />

        <div className="p-6 space-y-6 max-w-4xl">
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "active" ? "primary" : "outline"}
                  onClick={() => setStatusFilter("active")}
                >
                  Active
                </Button>

                <Button
                  variant={statusFilter === "expired" ? "primary" : "outline"}
                  onClick={() => setStatusFilter("expired")}
                >
                  Expired
                </Button>
              </div>
          {loading && !filteredSubscriptions.length ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No {statusFilter === "active" ? "Active" : "Expired"} Subscriptions
              </h3>
              <p className="text-muted-foreground mb-6">
                You haven't subscribed to any mentors yet. Browse mentors and subscribe to get started.
              </p>
              <Button>
                <Link href="/dashboard/mentors">Browse Mentors</Link>
              </Button>
            </Card>
          ) : (
            <>

              <div className="space-y-4">
                {filteredSubscriptions.map((subscription) => (
                  <Card key={subscription.id} className="hover:border-primary/50 transition-colors">
                    <Link href={`/dashboard/mentors/${subscription.mentor_profile_id}`} className="flex items-start justify-between gap-4">
                      <div className="flex gap-2 md:gap-4 flex-1">
                        {/* Mentor Avatar */}
                        <div className="h-10 md:h-16 w-10 md:w-16 rounded-full bg-linear-to-br from-primary to-accent shrink-0 overflow-hidden">
                          {subscription.mentor?.avatar_url ? (
                            <img
                              src={subscription.mentor.avatar_url || "/placeholder.svg"}
                              alt={subscription.mentor.first_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-white font-bold">
                              {subscription.mentor?.first_name?.[0]}
                              {subscription.mentor?.last_name?.[0]}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-base md:text-lg font-semibold text-foreground">
                              {subscription.mentor?.first_name} {subscription.mentor?.last_name}
                            </h3>
                            <Badge className={getStatusColor(subscription.status)}>
                              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                            </Badge>
                          </div>

                          <p className="text-xs md:text-sm text-muted-foreground mb-3">{subscription.mentor?.school}</p>

                          {/* Expertise Tags */}
                          {subscription.mentor_profile?.expertise && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {subscription.mentor_profile.expertise.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {subscription.mentor_profile.expertise.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{subscription.mentor_profile.expertise.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Duration and Dates */}
                          <div className="flex flex-col md:flex-row gap-4 text-xs md:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{getDurationLabel(subscription.duration)} duration</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(subscription.start_date).toLocaleDateString()} -
                                {new Date(subscription.end_date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-primary">{subscription.points_cost} credits</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                    {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} subscriptions
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
