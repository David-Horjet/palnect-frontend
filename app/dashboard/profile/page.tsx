"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/shared/form-field"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Star, Mail, GraduationCap, BookOpen } from "lucide-react"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    school: "University of Lagos",
    department: "Computer Science",
    yearOfStudy: "100",
    bio: "Passionate about learning and sharing knowledge with peers. Always ready to help others succeed.",
    isMentor: true,
  })

  const [formData, setFormData] = useState(profile)
  const [mentorProfile, setMentorProfile] = useState({
    expertise: ["Mathematics", "Physics", "Computer Science"],
    dailyRate: 500,
    weeklyRate: 2500,
    monthlyRate: 8000,
    bio: "10+ years of tutoring experience. Specialized in mathematics and physics.",
    rating: 4.9,
    totalStudents: 156,
  })
  const [mentorFormData, setMentorFormData] = useState(mentorProfile)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMentorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMentorFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setProfile(formData)
    if (profile.isMentor) {
      setMentorProfile(mentorFormData)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(profile)
    setMentorFormData(mentorProfile)
    setIsEditing(false)
  }

  const removeSkill = (skill: string) => {
    setMentorFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((s) => s !== skill),
    }))
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="profile" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="My Profile" subtitle="Manage your personal and mentorship information" />

        <div className="p-6 space-y-6 max-w-4xl">
          {/* Profile Header */}
          <Card>
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between md:items-center">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground mb-2">{profile.name}</h1>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>
                        {profile.school} • Year {profile.yearOfStudy} • {profile.department}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {!isEditing && (
                <Button variant="primary" onClick={() => setIsEditing(true)} className="md:self-start">
                  Edit Profile
                </Button>
              )}
            </div>
          </Card>

          {/* Bio */}
          <Card>
            <h2 className="text-lg font-bold mb-4 text-foreground">About</h2>
            {isEditing ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bio</label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
            ) : (
              <p className="text-muted-foreground">{profile.bio}</p>
            )}
          </Card>

          {/* Student Info */}
          <Card>
            <h2 className="text-lg font-bold mb-4 text-foreground">Educational Information</h2>
            {isEditing ? (
              <div className="space-y-4">
                <FormField
                  label="School/University"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="Your institution"
                />
                <FormField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Your department"
                />
                <FormField
                  label="Year of Study"
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  placeholder="100, 200, 300, 400"
                />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">School</p>
                  <p className="text-foreground">{profile.school}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Department</p>
                  <p className="text-foreground">{profile.department}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Year of Study</p>
                  <p className="text-foreground">Year {profile.yearOfStudy}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Mentor Profile (if applicable) */}
          {profile.isMentor && (
            <>
              <Card>
                <h2 className="text-lg font-bold mb-4 text-foreground">Mentorship Profile</h2>

                {!isEditing && (
                  <div className="space-y-4">
                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-1">Rating</p>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(mentorProfile.rating) ? "fill-accent text-accent" : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-lg font-bold text-foreground">{mentorProfile.rating}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-1">Total Students</p>
                        <p className="text-2xl font-bold text-foreground">{mentorProfile.totalStudents}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-1">Active Status</p>
                        <p className="text-lg font-bold text-primary">Active</p>
                      </div>
                    </div>

                    {/* Expertise */}
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-3">Expertise Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {mentorProfile.expertise.map((skill) => (
                          <div
                            key={skill}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Mentorship Bio</p>
                      <p className="text-muted-foreground">{mentorProfile.bio}</p>
                    </div>

                    {/* Rates */}
                    <div className="grid md:grid-cols-3 gap-3 pt-3 border-t border-border/50">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Daily Rate</p>
                        <p className="text-xl font-bold text-foreground">{mentorProfile.dailyRate}</p>
                        <p className="text-xs text-muted-foreground">points/day</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Weekly Rate</p>
                        <p className="text-xl font-bold text-foreground">{mentorProfile.weeklyRate}</p>
                        <p className="text-xs text-muted-foreground">points/week</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Monthly Rate</p>
                        <p className="text-xl font-bold text-foreground">{mentorProfile.monthlyRate}</p>
                        <p className="text-xs text-muted-foreground">points/month</p>
                      </div>
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="space-y-4">
                    <FormField
                      label="Expertise Areas (comma separated)"
                      name="expertise"
                      placeholder="Mathematics, Physics, etc."
                    />
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentorFormData.expertise.map((skill) => (
                        <div
                          key={skill}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                        >
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="ml-1 hover:opacity-70">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <FormField
                      label="Mentorship Bio"
                      name="bio"
                      value={mentorFormData.bio}
                      onChange={handleMentorChange}
                      placeholder="Tell students about your mentoring approach"
                      multiline
                      rows={4}
                    />

                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        label="Daily Rate (points)"
                        name="dailyRate"
                        type="number"
                        // value={mentorFormData.dailyRate}
                        onChange={handleMentorChange}
                      />
                      <FormField
                        label="Weekly Rate (points)"
                        name="weeklyRate"
                        type="number"
                        // value={mentorFormData.weeklyRate}
                        onChange={handleMentorChange}
                      />
                      <FormField
                        label="Monthly Rate (points)"
                        name="monthlyRate"
                        type="number"
                        // value={mentorFormData.monthlyRate}
                        onChange={handleMentorChange}
                      />
                    </div>
                  </div>
                )}
              </Card>
            </>
          )}

          {/* Resources Uploaded */}
          <Card>
            <h2 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Resources Uploaded
            </h2>
            <div className="space-y-3">
              {[
                { title: "Physics Lecture Notes - Chapter 5", downloads: 342, date: "2 days ago" },
                { title: "Mathematics Study Guide", downloads: 218, date: "1 week ago" },
                { title: "Chemistry Assignment Solutions", downloads: 156, date: "2 weeks ago" },
              ].map((resource, i) => (
                <div
                  key={i}
                  className="p-3 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors"
                >
                  <p className="font-semibold text-foreground text-sm">{resource.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {resource.downloads} downloads • {resource.date}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3">
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
