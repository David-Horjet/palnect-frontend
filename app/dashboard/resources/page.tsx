"use client"

import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { ResourceCard } from "@/components/shared/resource-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Search, BookOpen } from "lucide-react"
import Link from "next/link"

interface Resource {
  id: string
  title: string
  description: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  tags: string[]
  rating: number
  students: number
  duration: string
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const resources: Resource[] = [
    {
      id: "1",
      title: "React Fundamentals",
      description: "Learn the basics of React including components, hooks, and state management",
      category: "Development",
      level: "beginner",
      tags: ["React", "JavaScript"],
      rating: 4.8,
      students: 2341,
      duration: "6 weeks",
    },
    {
      id: "2",
      title: "Advanced TypeScript Patterns",
      description: "Master advanced TypeScript concepts and design patterns for enterprise applications",
      category: "Development",
      level: "advanced",
      tags: ["TypeScript", "JavaScript"],
      rating: 4.9,
      students: 1203,
      duration: "8 weeks",
    },
    {
      id: "3",
      title: "Web Design Principles",
      description: "Understand the fundamentals of web design and user experience",
      category: "Design",
      level: "beginner",
      tags: ["Design", "UX"],
      rating: 4.7,
      students: 1856,
      duration: "4 weeks",
    },
    {
      id: "4",
      title: "Node.js & Express",
      description: "Build scalable backend applications with Node.js and Express",
      category: "Development",
      level: "intermediate",
      tags: ["Node.js", "Backend"],
      rating: 4.8,
      students: 1567,
      duration: "6 weeks",
    },
    {
      id: "5",
      title: "Database Design",
      description: "Learn database design principles, SQL, and optimization techniques",
      category: "Development",
      level: "intermediate",
      tags: ["Database", "SQL"],
      rating: 4.6,
      students: 987,
      duration: "5 weeks",
    },
    {
      id: "6",
      title: "UI Animation Masterclass",
      description: "Create beautiful animations and interactions for web applications",
      category: "Design",
      level: "advanced",
      tags: ["Animation", "Design"],
      rating: 4.9,
      students: 1421,
      duration: "7 weeks",
    },
  ]

  const categories = ["All", "Development", "Design", "Product", "Business"]
  const levels = ["All", "Beginner", "Intermediate", "Advanced"]

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLevel =
      !selectedLevel || selectedLevel === "All" || resource.level.toLowerCase() === selectedLevel.toLowerCase()

    const matchesCategory = !selectedCategory || selectedCategory === "All" || resource.category === selectedCategory

    return matchesSearch && matchesLevel && matchesCategory
  })

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="resources" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="Learning Resources" subtitle="Browse and explore curated learning materials" />

        <div className="p-6">
          {/* Search and Filter */}
          <div className="space-y-4 mb-8">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <p className="text-sm font-medium mb-2 text-foreground">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "primary"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(cat === "All" ? null : cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <p className="text-sm font-medium mb-2 text-foreground">Level</p>
                <div className="flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <Badge
                      key={level}
                      variant={selectedLevel === level ? "default" : "primary"}
                      className="cursor-pointer"
                      onClick={() => setSelectedLevel(level === "All" ? null : level)}
                    >
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground">
              Found {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Link key={resource.id} href={`/dashboard/resources/${resource.id}`}>
                <ResourceCard {...resource} />
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedLevel(null)
                  setSelectedCategory(null)
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
