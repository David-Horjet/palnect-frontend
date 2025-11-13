"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPendingMentors, approveMentor } from "@/store/slices/adminSlice"
import type { AppDispatch, RootState } from "@/store/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { GraduationCap } from "lucide-react"

export default function AdminMentorsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { pendingMentors, loading } = useSelector((state: RootState) => state.admin)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(getPendingMentors())
  }, [dispatch])

  const handleApprove = async (mentorId: string, approved: boolean) => {
    setProcessingId(mentorId)
    const result = await dispatch(
      approveMentor({
        mentorId,
        approved,
      }),
    )

    if (result.type === approveMentor.fulfilled.type) {
      setProcessingId(null)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mentor Management</h1>
        <p className="text-muted-foreground">Review and approve pending mentor applications</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array(3)
            .fill(null)
            .map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-24" />
                </CardContent>
              </Card>
            ))
        ) : pendingMentors.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-4xl flex w-full justify-center mb-2"><GraduationCap /></div>
                <p className="text-muted-foreground">No pending mentor applications</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          pendingMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {mentor.user.first_name} {mentor.user.last_name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{mentor.user.email}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-xs font-medium">
                    Pending
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">School</div>
                    <div className="font-medium text-foreground">{mentor.user.school}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Department</div>
                    <div className="font-medium text-foreground">{mentor.user.department}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Daily Rate</div>
                    <div className="font-medium text-foreground">{mentor.daily_rate} points/day</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Applied</div>
                    <div className="font-medium text-foreground">
                      {new Date(mentor.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-2">Bio</div>
                  <p className="text-sm text-foreground">{mentor.bio}</p>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-2">Expertise</div>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((exp, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => handleApprove(mentor.id, true)}
                    disabled={processingId === mentor.id}
                    className="flex-1"
                  >
                    {processingId === mentor.id ? "Processing..." : "Approve"}
                  </Button>
                  <Button
                    onClick={() => handleApprove(mentor.id, false)}
                    disabled={processingId === mentor.id}
                    variant="secondary"
                    className="flex-1"
                  >
                    {processingId === mentor.id ? "Processing..." : "Reject"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
