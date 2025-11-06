"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { MentorCard } from "@/components/shared/mentor-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Search, Users } from "lucide-react"
import Link from "next/link"

interface Mentor {
  id: string
  name: string
  title: string
  bio: string
  expertise: string[]
  rating: number
  students: number
  location: string
  availability: "available" | "limited" | "unavailable"
  responseTime: string
  hourlyRate?: number
}

export default function MentorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [availability, setAvailability] = useState<string | null>(null)

  const mentors: Mentor[] = [
    {
      id: "1",
      name: "Sarah Chen",
      title: "Senior Frontend Engineer",
      bio: "10+ years building React applications at top tech companies. Passionate about mentoring and open source.",
      expertise: ["React", "TypeScript", "Web Design", "Performance"],
      rating: 4.9,
      students: 156,
      location: "San Francisco, CA",
      availability: "available",
      responseTime: "< 2 hours",
      hourlyRate: 75,
    },
    {
      id: "2",
      name: "Alex Rodriguez",
      title: "Full Stack Developer",
      bio: "Building scalable backend systems and full-stack applications. Expert in cloud deployment.",
      expertise: ["Node.js", "MongoDB", "AWS", "Docker"],
      rating: 4.8,
      students: 132,
      location: "New York, NY",
      availability: "available",
      responseTime: "< 4 hours",
      hourlyRate: 65,
    },
    {
      id: "3",
      name: "Jordan Kim",
      title: "Product Manager & Designer",
      bio: "Leading product strategy and design at scale. Specializing in UX research and user-centered design.",
      expertise: ["Product Management", "UX Research", "Figma", "Analytics"],
      rating: 4.7,
      students: 98,
      location: "Austin, TX",
      availability: "limited",
      responseTime: "< 8 hours",
      hourlyRate: 85,
    },
    {
      id: "4",
      name: "Priya Sharma",
      title: "Data Science & ML Engineer",
      bio: "Machine learning expert with experience building production ML systems. Teaching data science fundamentals.",
      expertise: ["Python", "Machine Learning", "TensorFlow", "SQL"],
      rating: 4.9,
      students: 203,
      location: "Seattle, WA",
      availability: "available",
      responseTime: "< 3 hours",
      hourlyRate: 80,
    },
    {
      id: "5",
      name: "Marcus Johnson",
      title: "DevOps & Infrastructure",
      bio: "Kubernetes expert and infrastructure architect. Helping teams scale their systems.",
      expertise: ["Kubernetes", "AWS", "CI/CD", "Infrastructure"],
      rating: 4.6,
      students: 87,
      location: "Boston, MA",
      availability: "available",
      responseTime: "< 5 hours",
      hourlyRate: 70,
    },
    {
      id: "6",
      name: "Emma Thompson",
      title: "Startup Founder & Advisor",
      bio: "Founded 2 successful startups. Now advising founders and helping them navigate fundraising.",
      expertise: ["Startup Strategy", "Fundraising", "Growth", "Leadership"],
      rating: 4.8,
      students: 145,
      location: "San Francisco, CA",
      availability: "limited",
      responseTime: "< 12 hours",
      hourlyRate: 150,
    },
  ]

  const allSkills = Array.from(new Set(mentors.flatMap((m) => m.expertise))).sort()

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSkills =
      selectedSkills.length === 0 || selectedSkills.some((skill) => mentor.expertise.includes(skill))

    const matchesAvailability = !availability || mentor.availability === availability

    return matchesSearch && matchesSkills && matchesAvailability
  })

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="mentors" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="Find Your Mentor" subtitle="Connect with experienced professionals in your field" />

        <div className="p-6">
          {/* Search and Filters */}
          <div className="space-y-6 mb-8">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, title, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Section */}
            <Card className="p-6">
              <div className="space-y-6">
                {/* Skills Filter */}
                <div>
                  <p className="text-sm font-medium mb-3 text-foreground">Skills & Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <p className="text-sm font-medium mb-3 text-foreground">Availability</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: null, label: "All" },
                      { id: "available", label: "Available Now" },
                      { id: "limited", label: "Limited Availability" },
                    ].map((option) => (
                      <Badge
                        key={option.label}
                        variant={availability === option.id ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setAvailability(option.id)}
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Results Count */}
                <p className="text-sm text-muted-foreground">
                  Found {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""}
                </p>
              </div>
            </Card>
          </div>

          {/* Mentors Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <Link key={mentor.id} href={`/dashboard/mentors/${mentor.id}`}>
                <div className="h-full">
                  <MentorCard {...mentor} />
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No mentors found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedSkills([])
                  setAvailability(null)
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
