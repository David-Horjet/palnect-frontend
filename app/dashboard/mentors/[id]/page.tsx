"use client"


import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Star, Users, Clock, Calendar, MessageSquare, Award } from "lucide-react"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

export default function MentorDetailPage({ params }: { params: { id: string } }) {
  const [isConnected, setIsConnected] = useState(false)

  // Mock mentor data
  const mentor = {
    id: params.id,
    name: "Sarah Chen",
    title: "Senior Frontend Engineer at Google",
    bio: "10+ years of experience building scalable React applications. Passionate about mentoring and helping junior developers grow their careers.",
    image: "",
    expertise: ["React", "TypeScript", "Web Design", "Performance", "Testing"],
    rating: 4.9,
    reviews: 89,
    students: 156,
    location: "San Francisco, CA",
    timezone: "PST",
    availability: "available",
    responseTime: "< 2 hours",
    hourlyRate: 75,
    bio_full: `I'm a senior frontend engineer at Google with over 10 years of experience building large-scale React applications. Throughout my career, I've worked with teams at startups and Fortune 500 companies, and I'm passionate about sharing my knowledge with the next generation of developers.

My expertise spans modern frontend development, performance optimization, and mentoring. I've helped dozens of junior developers transition into senior roles and have a track record of helping teams improve their engineering practices.`,
    experience: [
      { title: "Senior Engineer", company: "Google", years: "2019 - Present" },
      { title: "Staff Engineer", company: "Airbnb", years: "2016 - 2019" },
      { title: "Frontend Engineer", company: "Uber", years: "2013 - 2016" },
    ],
    mentoring_style: [
      "One-on-one sessions focused on your goals",
      "Code review and architectural guidance",
      "Career development and job preparation",
      "Interview preparation",
      "Project-based learning",
    ],
    achievements: [
      "Mentored 100+ engineers",
      "Built high-performance teams",
      "Open source contributor",
      "Technical speaker",
    ],
    availability_schedule: [
      { day: "Monday", time: "6:00 PM - 8:00 PM" },
      { day: "Wednesday", time: "5:00 PM - 7:00 PM" },
      { day: "Friday", time: "4:00 PM - 7:00 PM" },
      { day: "Saturday", time: "10:00 AM - 12:00 PM" },
    ],
    reviews_data: [
      {
        author: "John Doe",
        rating: 5,
        text: "Sarah's mentoring completely transformed my React skills. Highly recommended!",
        date: "2 weeks ago",
      },
      {
        author: "Jane Smith",
        rating: 5,
        text: "Great mentor! Very responsive and provides practical, actionable advice.",
        date: "1 month ago",
      },
      {
        author: "Mike Johnson",
        rating: 4,
        text: "Excellent guidance on performance optimization. Very knowledgeable.",
        date: "1 month ago",
      },
    ],
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />

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
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2">
                {/* Avatar and Name */}
                <div className="flex gap-4 mb-6">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0" />
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground">{mentor.name}</h1>
                    <p className="text-muted-foreground mb-3">{mentor.title}</p>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-semibold">{mentor.rating}</span>
                        <span className="text-muted-foreground">({mentor.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{mentor.students} students</span>
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

                <p className="text-muted-foreground">{mentor.bio}</p>
              </div>

              {/* Connection Card */}
              <Card className="h-fit p-6">
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{mentor.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Available now</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{mentor.hourlyRate}/hour</span>
                  </div>
                </div>

                {isConnected ? (
                  <>
                    <Button variant="secondary" className="w-full mb-2">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="accent" className="w-full bg-transparent" onClick={() => setIsConnected(false)}>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" className="w-full" onClick={() => setIsConnected(true)}>
                    Connect
                  </Button>
                )}
              </Card>
            </div>
          </Card>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <Card>
                <h2 className="text-lg font-bold mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{mentor.bio_full}</p>
              </Card>

              {/* Experience */}
              <Card>
                <h2 className="text-lg font-bold mb-4">Experience</h2>
                <div className="space-y-4">
                  {mentor.experience.map((exp, i) => (
                    <div key={i} className="border-l-2 border-primary pl-4">
                      <p className="font-semibold text-foreground">{exp.title}</p>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.years}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Mentoring Style */}
              <Card>
                <h2 className="text-lg font-bold mb-4">Mentoring Style</h2>
                <ul className="space-y-2">
                  {mentor.mentoring_style.map((style, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground">
                      <span className="text-primary">•</span>
                      <span>{style}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Reviews */}
              <Card>
                <h2 className="text-lg font-bold mb-4">Student Reviews</h2>
                <div className="space-y-4">
                  {mentor.reviews_data.map((review, i) => (
                    <div key={i} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-foreground">{review.author}</p>
                        <div className="flex gap-1">
                          {Array.from({ length: review.rating }).map((_, j) => (
                            <Star key={j} className="h-3 w-3 fill-accent text-accent" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{review.text}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Availability */}
              <Card>
                <h3 className="font-bold mb-4">Available Times</h3>
                <div className="space-y-2">
                  {mentor.availability_schedule.map((slot, i) => (
                    <div key={i} className="text-sm">
                      <p className="font-medium text-foreground">{slot.day}</p>
                      <p className="text-muted-foreground">{slot.time}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Achievements */}
              <Card>
                <h3 className="font-bold mb-4">Achievements</h3>
                <ul className="space-y-2">
                  {mentor.achievements.map((achievement, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
