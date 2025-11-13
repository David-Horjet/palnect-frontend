"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchMentors } from "@/store/slices/mentorsSlice"
import { useAuth } from "@/hooks/useAuth"
import { Search, Users, Star, UserCheck, Loader2 } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

export default function MentorsPage() {
  const dispatch = useDispatch() as AppDispatch
  const { user, token } = useAuth()
  const { mentors, loading, pagination } = useSelector((state: RootState) => state.mentors)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState<string>("")
  const [page, setPage] = useState(1)
  const [displayedMentors, setDisplayedMentors] = useState<any[]>([])

  useEffect(() => {
    if (token) {
      dispatch(
        fetchMentors({
          token,
          page,
          limit: 20,
          expertise: selectedExpertise,
          search: searchQuery,
        }),
      )
    }
  }, [dispatch, token, page, selectedExpertise, searchQuery])

  const allExpertise = Array.from(new Set(mentors.flatMap((m) => m.expertise))).sort()

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < pagination.totalPages) setPage(page + 1)
  }

  if (!token) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar activeTab="mentors" />
        <main className="flex-1 overflow-auto">
          <DashboardHeader title="Loading..." />
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="mentors" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader
          title="Find Your Mentor"
          subtitle="Connect with experienced mentors and accelerate your learning"
        />

        <div className="p-6 space-y-6">
          {/* Header Actions */}
          <div className="flex gap-4 items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search mentors by name or expertise..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="primary">
              <Link href="/dashboard/mentors/apply">Become a Mentor</Link>
            </Button>
          </div>

          {/* Skills Filter */}
          {allExpertise.length > 0 && (
            <Card className="p-6">
              <p className="text-sm font-semibold mb-3 text-foreground">Filter by Expertise</p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedExpertise === "" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedExpertise("")
                    setPage(1)
                  }}
                >
                  All
                </Badge>
                {allExpertise.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedExpertise === skill ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedExpertise(skill)
                      setPage(1)
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Found {pagination.total} mentor{pagination.total !== 1 ? "s" : ""}
              </p>
            </Card>
          )}

          {/* Mentors Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : mentors.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                  <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm md:text-base font-bold text-foreground">
                              {mentor.user.first_name} {mentor.user.last_name}
                            </h3>
                            {mentor.is_approved && <UserCheck className="h-3 w-3 text-primary" />}
                          </div>
                          {mentor.rating && (
                            <div className="flex items-center gap-1 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(mentor.rating || 0) ? "fill-accent text-accent" : "text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-semibold">{mentor.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{mentor.bio}</p>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {mentor.expertise.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{mentor.expertise.length - 2}
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{mentor.total_students} students</span>
                        </div>
                      </div>

                      {/* Rates */}
                      <div className="bg-muted/20 rounded-lg p-3 space-y-1 text-xs">
                        <p className="font-semibold text-foreground">Rates (in points)</p>
                        <div className="space-y-1 text-muted-foreground">
                          <p>Daily: {mentor.daily_rate} pts</p>
                          <p>Weekly: {mentor.weekly_rate} pts</p>
                          <p>Monthly: {mentor.monthly_rate} pts</p>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button className="w-full">
                        <Link href={`/dashboard/mentors/${mentor.id}`}>View Profile & Subscribe</Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-6">
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages} • {pagination.total} total
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" disabled={page === 1 || loading} onClick={handlePrevPage}>
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={page >= pagination.totalPages || loading}
                    onClick={handleNextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No mentors found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedExpertise("")
                  setPage(1)
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
