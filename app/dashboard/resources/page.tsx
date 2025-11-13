"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Download, Plus, Loader2, ChevronDown } from "lucide-react"
import Link from "next/link"
import { listResources, getUserResources } from "@/store/slices/resourcesSlice"
import type { AppDispatch, RootState } from "@/store/store"
import type { Resource } from "@/services/api/resources"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

const CATEGORIES = ["Past Questions", "Lecture Notes", "Assignments", "Study Guides"]
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science"]
const SCHOOLS = ["University of Lagos", "University of Ibadan", "OAU"]
const YEARS = ["100", "200", "300", "400"]

export default function ResourcesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { resources, myResources, loading, pagination: paginationInfo } = useSelector((state: RootState) => state.resources)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"all" | "my">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })

  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    subject: false,
    school: false,
    year: false,
  })

  useEffect(() => {
    if (viewMode === "all") {
      dispatch(
        listResources({
          page: currentPage,
          limit: 20,
          category: selectedCategory || undefined,
          subject: selectedSubject || undefined,
          school: selectedSchool || undefined,
          year: selectedYear || undefined,
          search: searchQuery || undefined,
        }),
      )
    } else {
      dispatch(getUserResources({ page: currentPage, limit: 20 }))
    }
  }, [dispatch, viewMode, selectedCategory, selectedSubject, selectedSchool, selectedYear, searchQuery, currentPage])

  useEffect(() => {
    if (paginationInfo) {
      setPagination({
        total: paginationInfo.total,
        pages: paginationInfo.page,
      })
    }
  }, [paginationInfo])

  const displayedResources = viewMode === "my" ? myResources : resources
  const filteredResources = displayedResources.filter((resource: Resource) => {
    if (viewMode === "my") return true
    const matchesSearch =
      resource?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      resource?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    return matchesSearch
  })

  const handleDeleteResource = (resourceId: string) => {
    // Implement delete functionality here
    console.log(`Deleting resource with ID: ${resourceId}`)
  }

  const toggleFilterSection = (section: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="resources" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader
          title="Learning Resources"
          subtitle="Browse and download study materials shared by your peers"
        />

        <div className="p-6">
          {/* View Mode Toggle */}
          {/* View Mode Toggle */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="flex gap-5">
              <Button variant={viewMode === "all" ? "primary" : "secondary"} onClick={() => setViewMode("all")}>
                All Resources
              </Button>
              <Button variant={viewMode === "my" ? "primary" : "secondary"} onClick={() => setViewMode("my")}>
                My Resources
              </Button>
            </div>
            <div className="flex items-center  md:ml-auto">
              <Link href="/dashboard/resources/upload" className="ml-auto">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Resource
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search resources by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters - Only show for all resources view */}
          {viewMode === "all" && (
            <Card className="p-6 mb-6">
              <div className="space-y-4">
                {/* Category Filter */}
                <div>
                  <button
                    onClick={() => toggleFilterSection("category")}
                    className="w-full flex items-center justify-between"
                  >
                    <p className="text-sm font-semibold text-foreground">Category</p>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expandedFilters.category ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </button>
                  {expandedFilters.category && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {["All", ...CATEGORIES].map((cat) => (
                        <Badge
                          key={cat}
                          variant={
                            selectedCategory === cat || (cat === "All" && !selectedCategory) ? "default" : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(cat === "All" ? null : cat)}
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subject Filter */}
                <div className="border-t border-border/50 pt-4">
                  <button
                    onClick={() => toggleFilterSection("subject")}
                    className="w-full flex items-center justify-between"
                  >
                    <p className="text-sm font-semibold text-foreground">Department</p>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expandedFilters.subject ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </button>
                  {expandedFilters.subject && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {["All", ...SUBJECTS].map((subject) => (
                        <Badge
                          key={subject}
                          variant={
                            selectedSubject === subject || (subject === "All" && !selectedSubject)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => setSelectedSubject(subject === "All" ? null : subject)}
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* School Filter */}
                <div className="border-t border-border/50 pt-4">
                  <button
                    onClick={() => toggleFilterSection("school")}
                    className="w-full flex items-center justify-between"
                  >
                    <p className="text-sm font-semibold text-foreground">School</p>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expandedFilters.school ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </button>
                  {expandedFilters.school && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {["All", ...SCHOOLS].map((school) => (
                        <Badge
                          key={school}
                          variant={
                            selectedSchool === school || (school === "All" && !selectedSchool) ? "default" : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => setSelectedSchool(school === "All" ? null : school)}
                        >
                          {school}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Year Filter */}
                <div className="border-t border-border/50 pt-4">
                  <button
                    onClick={() => toggleFilterSection("year")}
                    className="w-full flex items-center justify-between"
                  >
                    <p className="text-sm font-semibold text-foreground">Year of Study</p>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expandedFilters.year ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </button>
                  {expandedFilters.year && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {["All", ...YEARS].map((year) => (
                        <Badge
                          key={year}
                          variant={selectedYear === year || (year === "All" && !selectedYear) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedYear(year === "All" ? null : year)}
                        >
                          {year}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Results Count */}
                <p className="text-sm text-muted-foreground pt-4 border-t border-border">
                  Showing {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""}
                </p>
              </div>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                <p className="text-muted-foreground">Loading resources...</p>
              </div>
            </div>
          )}

          {/* Resources Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource: Resource) => (
                <Link key={resource.id} href={`/dashboard/resources/${resource.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge className="text-xs">{resource.category}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {resource.file_size ? `${(resource.file_size / 1024 / 1024).toFixed(2)} MB` : "Unknown"}
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
                          <span>
                            by {resource.uploader.first_name} {resource.uploader.last_name}
                          </span>
                          <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              <span>{resource.downloads}</span>
                            </div>
                          </div>
                          {viewMode === "my" && (
                            <Button variant="outline" size="sm" onClick={() => handleDeleteResource(resource.id)}>
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-4">
                {viewMode === "my"
                  ? "You haven't uploaded any resources yet"
                  : "Try adjusting your filters or search query"}
              </p>
              {viewMode === "all" && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory(null)
                    setSelectedSubject(null)
                    setSelectedSchool(null)
                    setSelectedYear(null)
                    setCurrentPage(1)
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && filteredResources.length > 0 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage >= pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
