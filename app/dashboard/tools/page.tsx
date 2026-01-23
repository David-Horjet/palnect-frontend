"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { BookOpen, FileQuestion, Calculator } from "lucide-react"

export default function ToolsIndexPage() {
  const tools = [
    {
      id: "flash-cards",
      title: "Flashcards",
      description: "Create and study interactive flashcards to master key concepts.",
      href: "/dashboard/tools/flash-cards",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      animation: "animate-pulse",
    },
    {
      id: "quizzes",
      title: "Quizzes",
      description: "Generate and take quizzes to test your knowledge and track progress.",
      href: "/dashboard/tools/quizzes",
      icon: FileQuestion,
      color: "text-green-600",
      bgColor: "bg-green-50",
      animation: "animate-bounce",
    },
    {
      id: "cgpa",
      title: "CGPA Calculator",
      description: "Compute your semester CGPA using the Nigerian 5.0 grading system (A=5 to F=0).",
      href: "/dashboard/tools/cgpa",
      icon: Calculator,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      animation: "animate-pulse",
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="tools" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="Academic Tools" subtitle="Useful calculators and utilities for students" />

        <div className="p-6 space-y-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-4">
            {tools.map((t) => {
              const IconComponent = t.icon
              return (
                <Card key={t.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <Link href={t.href} className="flex w-full">
                    <div className="flex flex-col md:flex-row items-start gap-4 md:items-center justify-between">
                      <div className="flex gap-4">
                        <div className={`p-5 relative mx-auto mb-8 inline-flex items-center justify-center rounded-full ${t.bgColor}`}>
                          <IconComponent className={`h-5 w-5 ${t.color} ${t.animation}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                          {t.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{t.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
