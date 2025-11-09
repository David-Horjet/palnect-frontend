"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Search, BookOpen, Download, Eye, Plus } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

interface Resource {
  id: string
  title: string
  description: string
  category: "Past Questions" | "Lecture Notes" | "Assignments" | "Study Guides"
  subject: string
  year: string
  school: string
  uploader: string
  downloaders: number
  createdAt: string
  fileSize: string
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"all" | "my">("all") // add toggle between all resources and user's resources

  const allResources: Resource[] = [
    {
      id: "1",
      title: "Physics Lecture Notes - Chapter 5: Thermodynamics",
      description: "Comprehensive lecture notes covering heat transfer, entropy, and thermodynamic laws",
      category: "Lecture Notes",
      subject: "Physics",
      year: "100",
      school: "University of Lagos",
      uploader: "Sarah Chen",
      downloaders: 342,
      createdAt: "2 days ago",
      fileSize: "2.4 MB",
    },
    {
      id: "2",
      title: "Calculus Past Questions 2023",
      description: "Past exam questions from 2023 with solutions and explanations",
      category: "Past Questions",
      subject: "Mathematics",
      year: "100",
      school: "University of Lagos",
      uploader: "Marcus Johnson",
      downloaders: 521,
      createdAt: "5 days ago",
      fileSize: "1.8 MB",
    },
    {
      id: "3",
      title: "Biology Study Guide - Cell Division",
      description: "Visual study guide with diagrams and key concepts for cell division",
      category: "Study Guides",
      subject: "Biology",
      year: "100",
      school: "University of Lagos",
      uploader: "Emma Thompson",
      downloaders: 218,
      createdAt: "1 week ago",
      fileSize: "3.1 MB",
    },
    {
      id: "4",
      title: "Chemistry Assignment Solutions",
      description: "Complete solutions for chemistry assignments with step-by-step explanations",
      category: "Assignments",
      subject: "Chemistry",
      year: "100",
      school: "University of Ibadan",
      uploader: "James Wilson",
      downloaders: 156,
      createdAt: "1 week ago",
      fileSize: "1.5 MB",
    },
    {
      id: "5",
      title: "English Literature Past Questions",
      description: "Past exam papers for literature studies with model answers",
      category: "Past Questions",
      subject: "English",
      year: "100",
      school: "University of Lagos",
      uploader: "Priya Sharma",
      downloaders: 289,
      createdAt: "2 weeks ago",
      fileSize: "2.7 MB",
    },
    {
      id: "6",
      title: "Data Structures Lecture Notes",
      description: "Complete lecture notes covering arrays, linked lists, trees, and graphs",
      category: "Lecture Notes",
      subject: "Computer Science",
      year: "200",
      school: "University of Ibadan",
      uploader: "Robert Chen",
      downloaders: 412,
      createdAt: "3 days ago",
      fileSize: "2.2 MB",
    },
  ]

  const myResources: Resource[] = [
    {
      id: "7",
      title: "My Chemistry Notes - Chapter 3",
      description: "Personal study notes on organic chemistry reactions",
      category: "Lecture Notes",
      subject: "Chemistry",
      year: "100",
      school: "University of Lagos",
      uploader: "You",
      downloaders: 45,
      createdAt: "3 days ago",
      fileSize: "1.2 MB",
    },
  ]

  const resources = viewMode === "my" ? myResources : allResources

  const categories = ["All", "Past Questions", "Lecture Notes", "Assignments", "Study Guides"]
  const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science"]
  const schools = ["All", "University of Lagos", "University of Ibadan", "OAU"]
  const years = ["All", "100", "200", "300", "400"]

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !selectedCategory || selectedCategory === "All" || resource.category === selectedCategory
    const matchesSubject = !selectedSubject || selectedSubject === "All" || resource.subject === selectedSubject
    const matchesSchool = !selectedSchool || selectedSchool === "All" || resource.school === selectedSchool
    const matchesYear = !selectedYear || selectedYear === "All" || resource.year === selectedYear

    return matchesSearch && matchesCategory && matchesSubject && matchesSchool && matchesYear
  })

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="resources" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader
          title="Learning Resources"
          subtitle="Browse and download study materials shared by your peers"
        />

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant={viewMode === "all" ? "primary" : "secondary"} onClick={() => setViewMode("all")}>
              All Resources
            </Button>
            <Button variant={viewMode === "my" ? "primary" : "secondary"} onClick={() => setViewMode("my")}>
              My Resources
            </Button>
            <Link href="/dashboard/resources/upload" className="ml-auto">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Resource
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search resources by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <p className="text-sm font-semibold mb-3 text-foreground">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className="cursor-pointer"
                      // onClick={() => setSelectedCategory(cat === "All" ? null : cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Subject Filter */}
              <div>
                <p className="text-sm font-semibold mb-3 text-foreground">Subject</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant={selectedSubject === subject ? "default" : "outline"}
                      className="cursor-pointer"
                      // onClick={() => setSelectedSubject(subject === "All" ? null : subject)}
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* School Filter */}
              <div>
                <p className="text-sm font-semibold mb-3 text-foreground">School</p>
                <div className="flex flex-wrap gap-2">
                  {schools.map((school) => (
                    <Badge
                      key={school}
                      variant={selectedSchool === school ? "default" : "outline"}
                      className="cursor-pointer"
                      // onClick={() => setSelectedSchool(school === "All" ? null : school)}
                    >
                      {school}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Year Filter */}
              <div>
                <p className="text-sm font-semibold mb-3 text-foreground">Year of Study</p>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <Badge
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      className="cursor-pointer"
                      // onClick={() => setSelectedYear(year === "All" ? null : year)}
                    >
                      {year}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <p className="text-sm text-muted-foreground pt-2 border-t border-border">
                Showing {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""}
              </p>
            </div>
          </Card>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <Link key={resource.id} href={`/dashboard/resources/${resource.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge className="text-xs">{resource.category}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {resource.fileSize}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-bold text-foreground line-clamp-2 mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-border/50">
                      <div className="text-xs text-muted-foreground">
                        <p>
                          <span className="font-semibold">{resource.subject}</span> • Year {resource.year}
                        </p>
                        <p className="text-xs">{resource.school}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>by {resource.uploader}</span>
                        <span>{resource.createdAt}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>{resource.downloaders}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>342</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-4">
                {viewMode === "my"
                  ? "You haven't uploaded any resources yet"
                  : "Try adjusting your filters or search query"}
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory(null)
                  setSelectedSubject(null)
                  setSelectedSchool(null)
                  setSelectedYear(null)
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
