"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Eye, Lock, Globe, Loader2 } from "lucide-react"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [dailyLimit, setDailyLimit] = useState(2)
  const [isSaved, setIsSaved] = useState(false)

  // Mock resource data matching Palnect schema
  const resource = {
    id: params.id,
    title: "Physics Lecture Notes - Chapter 5: Thermodynamics",
    description: "Comprehensive lecture notes covering heat transfer, entropy, and thermodynamic laws",
    category: "Lecture Notes",
    subject: "Physics",
    year: "100",
    school: "University of Lagos",
    uploader: "Sarah Chen",
    uploaderAvatar: "SC",
    downloaders: 342,
    views: 1250,
    createdAt: "2 days ago",
    fileSize: "2.4 MB",
    isPrivate: false,
    isOwner: true,
  }

  // Mock summary data
  const mockSummary = `📚 Main Topics
- Heat Transfer: Conduction, convection, and radiation mechanisms
- Entropy: Concept of disorder and reversibility
- Thermodynamic Laws: First, second, and third laws explained

🔑 Key Concepts
- Enthalpy: Measure of total heat content in a system
- Gibbs Free Energy: Determines spontaneity of reactions
- Heat Capacity: Ability to store thermal energy

💡 Study Tips
- Practice solving numerical problems on heat transfer
- Memorize thermodynamic laws and their applications
- Draw diagrams for different heat transfer methods

⏱️ Estimated Study Time: 2-3 hours`

  const handleGetSummary = async () => {
    if (dailyLimit <= 0) {
      alert("Daily limit reached (3/3). Try again tomorrow!")
      return
    }

    setIsSummaryLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSummary(mockSummary)
      setDailyLimit(dailyLimit - 1)
      setIsSummaryLoading(false)
    }, 2000)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="resources" />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="px-6 py-4">
            <Link
              href="/dashboard/resources"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>
            <h1 className="text-2xl font-bold text-foreground">{resource.title}</h1>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Hero Section */}
          <Card className="bg-linear-to-br from-primary/10 to-accent/10 p-8">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Badge>{resource.category}</Badge>
                  <Badge variant="outline">{resource.subject}</Badge>
                  <Badge variant="outline">Year {resource.year}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{resource.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    <span>{resource.downloaders} downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    <span>{resource.views} views</span>
                  </div>
                  <div className="text-muted-foreground">
                    <span>{resource.fileSize}</span>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <Card className="p-6 h-fit">
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Uploaded by</p>
                    <p className="font-semibold">{resource.uploader}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">School</p>
                    <p className="font-semibold">{resource.school}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Visibility</p>
                    <div className="flex items-center gap-2">
                      {resource.isPrivate ? (
                        <>
                          <Lock className="h-4 w-4" />
                          <span>Private</span>
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4" />
                          <span>Public</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Card>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Resource Info */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Resource Details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{resource.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subject</span>
                    <span className="font-medium">{resource.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year of Study</span>
                    <span className="font-medium">Year {resource.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uploaded</span>
                    <span className="font-medium">{resource.createdAt}</span>
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
              {/* End AI Summary */}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Download */}
              <Card className="p-6">
                <Button variant="primary" size="lg" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resource
                </Button>
              </Card>

              {/* About Section */}
              <Card className="p-6">
                <h3 className="font-bold mb-4">About This Resource</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Type</p>
                    <p className="font-medium">{resource.category}</p>
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
