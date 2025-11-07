"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Search, Users, Star, UserCheck } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

interface Mentor {
  id: string
  name: string
  expertise: string[]
  rating: number
  totalStudents: number
  dailyRate?: number
  weeklyRate?: number
  monthlyRate?: number
  bio: string
  verified: boolean
}

export default function MentorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const mentors: Mentor[] = [
    {
      id: "1",
      name: "Sarah Chen",
      expertise: ["Mathematics", "Physics", "Calculus"],
      rating: 4.9,
      totalStudents: 156,
      dailyRate: 500,
      weeklyRate: 2500,
      monthlyRate: 8000,
      bio: "10+ years teaching experience. Specialized in making complex concepts simple.",
      verified: true,
    },
    {
      id: "2",
      name: "Alex Rodriguez",
      expertise: ["Chemistry", "Biology", "Organic Chemistry"],
      rating: 4.8,
      totalStudents: 132,
      dailyRate: 450,
      weeklyRate: 2200,
      monthlyRate: 7500,
      bio: "Former university lecturer with passion for student success.",
      verified: true,
    },
    {
      id: "3",
      name: "Jordan Kim",
      expertise: ["English", "Literature", "Writing"],
      rating: 4.7,
      totalStudents: 98,
      dailyRate: 400,
      weeklyRate: 2000,
      monthlyRate: 7000,
      bio: "Professional writer and educator helping students excel.",
      verified: false,
    },
    {
      id: "4",
      name: "Priya Sharma",
      expertise: ["Computer Science", "Programming", "Data Structures"],
      rating: 4.9,
      totalStudents: 203,
      dailyRate: 600,
      weeklyRate: 3000,
      monthlyRate: 9000,
      bio: "Software engineer mentor with real-world industry experience.",
      verified: true,
    },
    {
      id: "5",
      name: "Marcus Johnson",
      expertise: ["History", "Social Studies", "Economics"],
      rating: 4.6,
      totalStudents: 87,
      dailyRate: 350,
      weeklyRate: 1700,
      monthlyRate: 6000,
      bio: "Economics expert helping students understand complex theories.",
      verified: true,
    },
    {
      id: "6",
      name: "Emma Thompson",
      expertise: ["Art", "Design", "Visual Communication"],
      rating: 4.8,
      totalStudents: 145,
      dailyRate: 550,
      weeklyRate: 2700,
      monthlyRate: 8500,
      bio: "Creative mentor guiding students through design and art projects.",
      verified: true,
    },
  ]

  const allSkills = Array.from(new Set(mentors.flatMap((m) => m.expertise))).sort()

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSkills =
      selectedSkills.length === 0 || selectedSkills.some((skill) => mentor.expertise.includes(skill))

    return matchesSearch && matchesSkills
  })

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="mentors" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader
          title="Find Your Mentor"
          subtitle="Connect with experienced mentors and accelerate your learning"
        />

        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search mentors by name or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Skills Filter */}
          <Card className="p-6 mb-6">
            <p className="text-sm font-semibold mb-3 text-foreground">Filter by Expertise</p>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  className="cursor-pointer"
                  // onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
            {selectedSkills.length > 0 && (
              <p className="text-xs text-muted-foreground mt-3">
                Found {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""}
              </p>
            )}
          </Card>

          {/* Mentors Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{mentor.name}</h3>
                        {mentor.verified && <UserCheck className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(mentor.rating) ? "fill-accent text-accent" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold">{mentor.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground line-clamp-2">{mentor.bio}</p>

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
                      <span>{mentor.totalStudents} students</span>
                    </div>
                  </div>

                  {/* Rates */}
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-xs">
                    <p className="font-semibold text-foreground">Rates (in points)</p>
                    <div className="space-y-1 text-muted-foreground">
                      {mentor.dailyRate && <p>Daily: {mentor.dailyRate} pts</p>}
                      {mentor.weeklyRate && <p>Weekly: {mentor.weeklyRate} pts</p>}
                      {mentor.monthlyRate && <p>Monthly: {mentor.monthlyRate} pts</p>}
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

          {/* Empty State */}
          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No mentors found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedSkills([])
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
