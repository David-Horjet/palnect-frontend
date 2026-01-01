"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { CornerRightUp, CornerUpRight, SquareArrowUpRight, Wrench } from "lucide-react"

export default function ToolsIndexPage() {
  const tools = [
    {
      id: "cgpa",
      title: "CGPA Calculator",
      description: "Compute your semester CGPA using the Nigerian 5.0 grading system (A=5 to F=0).",
      href: "/dashboard/tools/cgpa",
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="tools" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="Academic Tools" subtitle="Useful calculators and utilities for students" />

        <div className="p-6 space-y-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-4">
            {tools.map((t) => (
              <Card key={t.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <Link href={t.href} className="flex w-full"> 
                  <div className="flex flex-col md:flex-row items-start gap-4 md:items-center justify-between">
                    <div className="flex gap-4">
                      <div className="bg-primary/10 p-5 relative mx-auto mb-8 inline-flex items-center justify-center rounded-full">
                        <Wrench className="h-5 w-5 text-primary" />
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
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
