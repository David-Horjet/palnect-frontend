"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { getProfile, updateProfile, uploadAvatar } from "@/store/slices/authSlice"
import type { AppDispatch } from "@/store/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/shared/form-field"
import { Textarea } from "@/components/ui/textarea"
import { Mail, GraduationCap, BookOpen } from "lucide-react"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

export default function ProfilePage() {
  const { user, dispatch: dispatchAuth, loading } = useAuth()
  console.log("User data in ProfilePage:", user)
  const dispatch = dispatchAuth as AppDispatch
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    school: user?.school || "",
    department: user?.department || "",
    yearOfStudy: user?.year_of_study || "",
    bio: user?.bio || "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        school: user.school || "",
        department: user.department || "",
        yearOfStudy: user.year_of_study || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    const result = await dispatch(
      updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        school: formData.school,
        department: formData.department,
        yearOfStudy: formData.yearOfStudy,
        bio: formData.bio,
      }),
    )

    if (result.type === updateProfile.fulfilled.type) {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        school: user.school || "",
        department: user.department || "",
        yearOfStudy: user.year_of_study || "",
        bio: user.bio || "",
      })
    }
    setIsEditing(false)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      dispatch(uploadAvatar(file))
    }
  }

  if (loading || !user) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar activeTab="profile" />
        <main className="flex-1 overflow-auto">
          <DashboardHeader title="Loading..." />
        </main>
      </div>
    )
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
                <div className="shrink-0">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url || "/placeholder.svg"}
                      alt="Avatar"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground mb-2">{`${user.first_name} ${user.last_name}`}</h1>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.school && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>
                          {user.school} • {user.year_of_study && `Year ${user.year_of_study}`} • {user.department}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!isEditing && (
                <Button variant="primary" onClick={() => setIsEditing(true)} className="md:self-start">
                  Edit Profile
                </Button>
              )}
            </div>

            {isEditing && (
              <div className="mt-6 pt-6 border-t border-border">
                <label className="block text-sm font-medium text-foreground mb-2">Upload Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="block w-full text-sm text-muted-foreground"
                />
              </div>
            )}
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
              <p className="text-muted-foreground">{formData.bio || "No bio added yet"}</p>
            )}
          </Card>

          {/* Student Info */}
          <Card>
            <h2 className="text-lg font-bold mb-4 text-foreground">Educational Information</h2>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Your first name"
                  />
                  <FormField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Your last name"
                  />
                </div>
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
                  <p className="text-foreground">{formData.school || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Department</p>
                  <p className="text-foreground">{formData.department || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Year of Study</p>
                  <p className="text-foreground">{formData.yearOfStudy ? `Year ${formData.yearOfStudy}` : "-"}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Resources Uploaded */}
          <Card>
            <h2 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Resources Uploaded
            </h2>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Your uploaded resources will appear here</p>
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
