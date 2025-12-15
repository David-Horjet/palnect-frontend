"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { applyMentor } from "@/store/slices/mentorsSlice"
import { useAuth } from "@/hooks/useAuth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/shared/form-field"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { showToast } from "@/lib/toast"

interface MentorApplyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MentorApplyModal({ isOpen, onClose }: MentorApplyModalProps) {
  const dispatch = useDispatch() as AppDispatch
  const { user, token } = useAuth()
  const { loading } = useSelector((state: RootState) => state.mentors)

  const [expertise, setExpertise] = useState<string[]>([])
  const [currentSkill, setCurrentSkill] = useState("")
  const [formData, setFormData] = useState({
    bio: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    weekdays: [] as string[],
    hours: "",
  })

  const availableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const handleAddSkill = () => {
    if (currentSkill.trim() && !expertise.includes(currentSkill)) {
      setExpertise([...expertise, currentSkill])
      setCurrentSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setExpertise(expertise.filter((s) => s !== skill))
  }

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      weekdays: prev.weekdays.includes(day) ? prev.weekdays.filter((d) => d !== day) : [...prev.weekdays, day],
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!expertise.length) {
      showToast("error", "Please add at least one expertise")
      return
    }

    if (!formData.bio.trim()) {
      showToast("error", "Please add a bio")
      return
    }

    if (!formData.weekdays.length) {
      showToast("error", "Please select at least one available day")
      return
    }

    if (!formData.hours.trim()) {
      showToast("error", "Please specify your availability hours")
      return
    }

    if (!token) {
      showToast("error", "You must be logged in to apply as a mentor")
      return
    }

    const result = await dispatch(
      applyMentor({
        token,
        data: {
          expertise,
          bio: formData.bio,
          dailyRate: Number(formData.dailyRate) || 0,
          weeklyRate: Number(formData.weeklyRate) || 0,
          monthlyRate: Number(formData.monthlyRate) || 0,
          availability: {
            weekdays: formData.weekdays,
            hours: formData.hours,
          },
        },
      }),
    )

    if (result.type === applyMentor.fulfilled.type) {
      setExpertise([])
      setFormData({
        bio: "",
        dailyRate: "",
        weeklyRate: "",
        monthlyRate: "",
        weekdays: [],
        hours: "",
      })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border/50 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Become a Mentor</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Share your expertise and earn credits by mentoring students
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Bio Section */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">About Your Mentoring</label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell students about your experience, teaching approach, and what they can learn from you..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-2">{formData.bio.length}/500 characters</p>
          </div>

          {/* Expertise Section */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Areas of Expertise</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                placeholder="e.g., Calculus, Human Anatomy, Data Structures"
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              />
              <Button type="button" onClick={handleAddSkill} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {expertise.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveSkill(skill)}
                >
                  {skill}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
            {!expertise.length && <p className="text-xs text-muted-foreground mt-2">Add at least one expertise</p>}
          </div>

          {/* Rates Section */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Mentorship Rates (in credits)</label>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                label="Daily Rate"
                name="dailyRate"
                type="number"
                value={formData.dailyRate}
                onChange={handleChange}
                placeholder="e.g., 5000"
              />
              <FormField
                label="Weekly Rate"
                name="weeklyRate"
                type="number"
                value={formData.weeklyRate}
                onChange={handleChange}
                placeholder="e.g., 30000"
              />
              <FormField
                label="Monthly Rate"
                name="monthlyRate"
                type="number"
                value={formData.monthlyRate}
                onChange={handleChange}
                placeholder="e.g., 100000"
              />
            </div>
          </div>

          {/* Availability Section */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Your Availability</label>
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Days available for mentoring</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.weekdays.includes(day)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/20 text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <FormField
              label="Availability Hours"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              placeholder="e.g., 6PM - 9PM"
              helperText="Specify your preferred hours for mentoring sessions"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-border">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading} className="flex-1">
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
