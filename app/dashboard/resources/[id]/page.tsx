"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Download, Loader2, Trash2 } from "lucide-react"
import { getResource, downloadResource, deleteResource, clearCurrentResource } from "@/store/slices/resourcesSlice"
import type { AppDispatch, RootState } from "@/store/store"
import { toast } from "@/lib/toast"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { currentResource, loading } = useSelector((state: RootState) => state.resources)
  const { user } = useSelector((state: RootState) => state.auth)

  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [dailyLimit, setDailyLimit] = useState(2)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    dispatch(getResource(params.id))

    return () => {
      dispatch(clearCurrentResource())
    }
  }, [params.id, dispatch])

  const handleGetSummary = async () => {
    if (dailyLimit <= 0) {
      toast.info("Daily limit reached (3/3). Try again tomorrow!")
      return
    }

    setIsSummaryLoading(true)
    setTimeout(() => {
      const mockSummary = `📚 Main Topics
- ${currentResource?.title}: Overview and key concepts
- Critical areas: Essential points to focus on
- Practice areas: Common problem types

🔑 Key Concepts
- Core theory and principles
- Application methods
- Problem-solving approaches

💡 Study Tips
- Review key concepts first
- Practice with examples
- Test your understanding with problems

⏱️ Estimated Study Time: 2-3 hours`
      setSummary(mockSummary)
      setDailyLimit(dailyLimit - 1)
      toast.success("Summary generated successfully")
      setIsSummaryLoading(false)
    }, 2500)
  }

  const handleDownload = async () => {
    try {
      await dispatch(downloadResource(params.id)).unwrap()
      if (currentResource?.file_url) {
        const link = document.createElement("a")
        link.href = currentResource.file_url
        link.download = currentResource.file_name || "resource.pdf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      toast.error("Failed to download resource")
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await dispatch(deleteResource(params.id)).unwrap()
        router.push("/dashboard/resources")
      } catch (error) {
        toast.error("Failed to delete resource")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar activeTab="resources" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
            <p className="text-muted-foreground">Loading resource...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!currentResource) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar activeTab="resources" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Resource not found</p>
            <Link href="/dashboard/resources">
              <Button>Back to Resources</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const isOwner = user?.id === currentResource.uploader.id

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="resources" />

      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="px-6 py-4">
            <Link
              href="/dashboard/resources"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>
            <h1 className="text-2xl font-bold text-foreground">{currentResource.title}</h1>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 p-8">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Badge>{currentResource.category}</Badge>
                  <Badge variant="outline">{currentResource.subject}</Badge>
                  <Badge variant="outline">Year {currentResource.year}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{currentResource.description}</p>

                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    <span>{currentResource.downloads} downloads</span>
                  </div>
                  <div className="text-muted-foreground">
                    <span>
                      {currentResource.file_size
                        ? `${(currentResource.file_size / 1024 / 1024).toFixed(2)} MB`
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              <Card className="p-6 h-fit">
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Uploaded by</p>
                    <p className="font-semibold">
                      {currentResource.uploader.first_name} {currentResource.uploader.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">School</p>
                    <p className="font-semibold">{currentResource.school}</p>
                  </div>
                </div>
              </Card>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Resource Details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{currentResource.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subject</span>
                    <span className="font-medium">{currentResource.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year of Study</span>
                    <span className="font-medium">Year {currentResource.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uploaded</span>
                    <span className="font-medium">{new Date(currentResource.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-bold">AI Summary</h2>
                  <Badge variant="outline" className="text-xs">
                    {dailyLimit}/3 used today
                  </Badge>
                </div>

                {summary ? (
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap text-sm text-muted-foreground font-mono">
                      {summary}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setIsSaved(!isSaved)}>
                        {isSaved ? "Saved" : "Save Summary"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setSummary(null)}>
                        Clear
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Get an AI-powered summary of this resource to study faster
                    </p>
                    <Button
                      onClick={handleGetSummary}
                      disabled={isSummaryLoading || dailyLimit <= 0}
                      className="w-full"
                    >
                      {isSummaryLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Generating Summary (30-60s)...
                        </>
                      ) : dailyLimit <= 0 ? (
                        "Daily Limit Reached"
                      ) : (
                        "Get AI Summary"
                      )}
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 space-y-3">
                <Button onClick={handleDownload} size="lg" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resource
                </Button>

                {isOwner && (
                  <Button onClick={handleDelete} variant="destructive" size="lg" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Resource
                  </Button>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-4">About This Resource</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Type</p>
                    <p className="font-medium">{currentResource.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Quality</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`h-2 w-8 rounded-full ${i < 4 ? "bg-accent" : "bg-muted"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">4/5 (28 ratings)</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
