"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { MentorApplyModal } from "@/components/mentors/mentor-apply-modal"

export default function ApplyMentorPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(true)

  const handleModalClose = () => {
    setIsModalOpen(false)
    router.back()
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="mentors" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="Mentor Application" subtitle="Share your knowledge and help students succeed" />

        <div className="p-6">
          <MentorApplyModal isOpen={isModalOpen} onClose={handleModalClose} />
        </div>
      </main>
    </div>
  )
}
