"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Bell, Lock, Eye, Database } from "lucide-react"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

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

export default function SettingsPage() {
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

  const toggleNotification = (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)))
  }

  const togglePrivacy = (id: string) => {
    setPrivacy((prev) => prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)))
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

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="settings" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="Settings" />

        <div className="p-6 space-y-6 max-w-4xl">
          {/* Notification Settings */}
          <Card>
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
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              ))}
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card>
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
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
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
              <Button variant="secondary" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                Enable Two-Factor Authentication
              </Button>
              <Button variant="secondary" className="w-full justify-start">
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
              >
                Download My Data
              </Button>
              <Button
                variant="accent"
                className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
              >
                Delete Account
              </Button>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button variant="primary">Save Changes</Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
