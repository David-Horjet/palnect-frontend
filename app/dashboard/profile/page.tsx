"use client"

import type React from "react"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/shared/form-field"
import { BadgeGroup } from "@/components/shared/badge-group"
import { useState } from "react"
import { Star, Mail, MapPin, LinkIcon } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    bio: "Passionate about web development and mentoring junior developers",
    location: "San Francisco, CA",
    website: "https://example.com",
    expertise: ["React", "TypeScript", "Node.js", "Web Design"],
  })

  const [formData, setFormData] = useState(profile)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setProfile(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((s) => s !== skill),
    }))
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="profile" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="My Profile" />

        <div className="p-6 space-y-6 max-w-4xl">
          {/* Profile Header */}
          <Card>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  AJ
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-2">{profile.name}</h1>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">156</p>
                    <p className="text-xs text-muted-foreground">Students Mentored</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <p className="text-sm font-semibold text-foreground">4.9</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <Button variant="primary" onClick={() => setIsEditing(true)} className="md:self-start">
                  Edit Profile
                </Button>
              )}
            </div>
          </Card>

          {/* Bio */}
          <Card>
            <h2 className="text-lg font-bold mb-4">About</h2>
            {isEditing ? (
              <FormField label="Bio" name="bio" multiline rows={4} value={formData.bio} onChange={handleChange} />
            ) : (
              <p className="text-muted-foreground">{profile.bio}</p>
            )}
          </Card>

          {/* Expertise */}
          <Card>
            <h2 className="text-lg font-bold mb-4">Expertise & Skills</h2>
            {isEditing ? (
              <div className="space-y-4">
                <BadgeGroup items={formData.expertise} onRemove={removeSkill} variant="secondary" />
                <FormField label="Add Skill" name="newSkill" placeholder="Enter a skill and press Enter" />
              </div>
            ) : (
              <BadgeGroup items={profile.expertise} variant="secondary" />
            )}
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
