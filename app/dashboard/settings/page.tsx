"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Bell, Lock, Eye, Database } from "lucide-react"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { AppDispatch } from "@/store/store"
import { FormField } from "@/components/shared/form-field"
import { changePassword } from "@/store/slices/authSlice"
import { useTheme } from "@/lib/contexts/ThemeContext"

interface SettingsSection {
  icon: React.ReactNode
  title: string
  description: string
}

interface SettingToggle {
  id: string
  label: string
  description: string
  enabled: boolean
}

interface ThemeToggle {
  id: string
  label: string
  description: string
  enabled: boolean
}

export default function SettingsPage() {

  const { dispatch: dispatchAuth } = useAuth()
  const dispatch = dispatchAuth as AppDispatch
  const { theme: currentTheme, toggleTheme: toggleThemeContext } = useTheme()

  useEffect(() => {
    setTheme((prev) =>
      prev.map((item) =>
        item.id === "change-theme" ? { ...item, enabled: currentTheme === "dark" } : item
      )
    )
  }, [currentTheme])

  const [notifications, setNotifications] = useState<SettingToggle[]>([
    {
      id: "email-resources",
      label: "New Resources",
      description: "Get notified when new resources are added",
      enabled: true,
    },
    {
      id: "mentor-updates",
      label: "Mentor Updates",
      description: "Receive updates from your mentors",
      enabled: true,
    },
    {
      id: "community",
      label: "Community Activity",
      description: "Stay updated on community events and discussions",
      enabled: false,
    },
    {
      id: "weekly-digest",
      label: "Weekly Digest",
      description: "Get a weekly summary of your progress",
      enabled: true,
    },
  ])

  const [privacy, setPrivacy] = useState<SettingToggle[]>([
    {
      id: "public-profile",
      label: "Public Profile",
      description: "Allow others to see your profile",
      enabled: true,
    },
    {
      id: "show-achievements",
      label: "Show Achievements",
      description: "Display your achievements publicly",
      enabled: true,
    },
    {
      id: "show-learning-progress",
      label: "Learning Progress",
      description: "Show your learning streaks and progress",
      enabled: false,
    },
  ])

  const [theme, setTheme] = useState<ThemeToggle[]>([
    {
      id: "change-theme",
      label: "Change Theme",
      description: "Switch to dark mode",
      enabled: currentTheme === "dark",
    },
  ])

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  const toggleNotification = (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)))
  }

  const togglePrivacy = (id: string) => {
    setPrivacy((prev) => prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)))
  }

  const toggleTheme = (id: string) => {
    toggleThemeContext() // toggles theme in your context
    setTheme((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: currentTheme !== "dark" } : item
      )
    )
  }

  const settings: SettingsSection[] = [
    {
      icon: <Bell className="h-5 w-5" />,
      title: "Notifications",
      description: "Manage how you receive notifications",
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Privacy & Visibility",
      description: "Control what others can see about you",
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Security",
      description: "Manage your account security",
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: "Data Management",
      description: "Download or delete your data",
    },
  ]

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {}
    if (!currentPassword) errors.currentPassword = "Current password is required"
    if (!newPassword) errors.newPassword = "New password is required"
    if (newPassword.length < 8) errors.newPassword = "Password must be at least 8 characters"
    if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match"
    return errors
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validatePasswordForm()
    setPasswordErrors(errors)

    if (Object.keys(errors).length === 0) {
      const result = await dispatch(
        changePassword({
          currentPassword,
          newPassword,
        }),
      )

      if (result.type === changePassword.fulfilled.type) {
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="settings" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="Settings" />

        <div className="p-6 space-y-6 max-w-4xl">
          {/* Notification Settings */}
          {/* <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">Notifications</h2>
                <p className="text-sm text-muted-foreground">Choose what notifications you'd like to receive</p>
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              {notifications.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleNotification(item.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              ))}
            </div>
          </Card> */}

          {/* Privacy Settings */}
          {/* <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Eye className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">Privacy & Visibility</h2>
                <p className="text-sm text-muted-foreground">Control your visibility on Palnect</p>
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              {privacy.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => togglePrivacy(item.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              ))}
            </div>
          </Card> */}

          {/* Theme Settings */}
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Eye className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">Theme Settings</h2>
                <p className="text-sm text-muted-foreground">Customize your Palnect experience</p>
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              {theme.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleTheme(item.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              ))}
            </div>
          </Card>

          {/* Security Settings */}
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Lock className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">Security</h2>
                <p className="text-sm text-muted-foreground">Manage your account security</p>
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <FormField
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={passwordErrors.currentPassword}
                />
                <FormField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={passwordErrors.newPassword}
                />
                <FormField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={passwordErrors.confirmPassword}
                />
                <Button type="submit" variant="secondary" className="w-full justify-start">
                  Change Password
                </Button>
              </form>

              <Button variant="secondary" className="w-full justify-start" disabled>
                Enable Two-Factor Authentication
              </Button>
              <Button variant="secondary" className="w-full justify-start" disabled>
                View Active Sessions
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50 bg-destructive/5">
            <h2 className="text-lg font-bold text-destructive mb-2">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">Irreversible actions</p>
            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
                disabled
              >
                Download My Data
              </Button>
              <Button
                variant="accent"
                className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
                disabled
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
