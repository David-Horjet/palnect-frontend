"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Star, Users, Clock, CheckCircle } from "lucide-react"

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  // Mock resource data
  const resource = {
    id: params.id,
    title: "React Advanced Patterns",
    description:
      "Master advanced React patterns, custom hooks, and state management solutions for building scalable applications.",
    category: "Development",
    level: "advanced",
    rating: 4.9,
    reviews: 542,
    students: 3421,
    duration: "8 weeks",
    instructor: {
      name: "Sarah Chen",
      title: "Senior React Engineer",
      bio: "10+ years of experience building enterprise React applications",
    },
    whatYouLearn: [
      "Advanced component patterns and composition",
      "Custom hooks and their use cases",
      "State management solutions (Redux, Zustand, Context)",
      "Performance optimization techniques",
      "Testing React applications",
      "Real-world project implementation",
    ],
    modules: [
      { id: 1, title: "Introduction to Advanced Patterns", lessons: 5, duration: "1 week" },
      { id: 2, title: "Custom Hooks Deep Dive", lessons: 6, duration: "1.5 weeks" },
      { id: 3, title: "State Management Patterns", lessons: 7, duration: "2 weeks" },
      { id: 4, title: "Performance Optimization", lessons: 5, duration: "1.5 weeks" },
      { id: 5, title: "Testing Strategies", lessons: 4, duration: "1 week" },
      { id: 6, title: "Capstone Project", lessons: 1, duration: "1 week" },
    ],
    tags: ["React", "JavaScript", "Advanced"],
    prerequisites: ["Basic React knowledge", "JavaScript fundamentals"],
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header with Back Button */}
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
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 p-8">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2">
                <Badge className="mb-4">{resource.category}</Badge>
                <p className="text-muted-foreground mb-4">{resource.description}</p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-accent text-accent" />
                    <span>
                      {resource.rating} ({resource.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>{resource.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{resource.duration}</span>
                  </div>
                </div>
              </div>

              {/* Enrollment Card */}
              <Card className="p-6 h-fit">
                {isEnrolled ? (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Progress</p>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
                    </div>
                    <Button variant="primary" className="w-full">
                      Continue Learning
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold mb-4">Free</p>
                    <Button variant="primary" className="w-full" onClick={() => setIsEnrolled(true)}>
                      Enroll Now
                    </Button>
                  </>
                )}
              </Card>
            </div>
          </Card>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Instructor */}
              <Card>
                <h2 className="text-lg font-bold mb-4">Your Instructor</h2>
                <div className="flex gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{resource.instructor.name}</h3>
                    <p className="text-sm text-muted-foreground">{resource.instructor.title}</p>
                    <p className="text-sm text-muted-foreground mt-2">{resource.instructor.bio}</p>
                  </div>
                </div>
              </Card>

              {/* What You Learn */}
              <Card>
                <h2 className="text-lg font-bold mb-4">What You'll Learn</h2>
                <ul className="space-y-3">
                  {resource.whatYouLearn.map((item, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Course Modules */}
              <Card>
                <h2 className="text-lg font-bold mb-4">Course Modules</h2>
                <div className="space-y-3">
                  {resource.modules.map((module, i) => (
                    <div
                      key={module.id}
                      className="flex items-start justify-between pb-3 border-b border-border last:border-b-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {i + 1}. {module.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{module.lessons} lessons</p>
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {module.duration}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Prerequisites */}
              <Card>
                <h2 className="text-lg font-bold mb-4">Prerequisites</h2>
                <ul className="space-y-2">
                  {resource.prerequisites.map((prereq, i) => (
                    <li key={i} className="text-muted-foreground flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tags */}
              <Card>
                <h3 className="font-bold mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Share */}
              <Card>
                <h3 className="font-bold mb-3">Share</h3>
                <Button variant="secondary" size="sm" className="w-full mb-2">
                  Share on Twitter
                </Button>
                <Button variant="secondary" size="sm" className="w-full">
                  Copy Link
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
