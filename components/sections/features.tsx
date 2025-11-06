"use client"

import { Card } from "@/components/ui/card"

interface FeatureItem {
  icon: string
  title: string
  description: string
  color: string
}

const features: FeatureItem[] = [
  {
    icon: "📚",
    title: "Premium Resources",
    description: "Curated learning materials from industry experts covering web development, design, and more.",
    color: "indigo",
  },
  {
    icon: "👥",
    title: "Expert Mentorship",
    description: "Get 1-on-1 guidance from experienced professionals in your field of interest.",
    color: "purple",
  },
  {
    icon: "🤖",
    title: "AI-Powered Tools",
    description: "Personalized learning paths and intelligent study summaries powered by AI.",
    color: "pink",
  },
  {
    icon: "🏆",
    title: "Achievement Tracking",
    description: "Visualize your progress with streaks, badges, and milestone achievements.",
    color: "indigo",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="space-y-4 text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold">Everything You Need</h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive platform designed to help you learn faster and achieve more.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="p-8 hover:shadow-lg transition-all duration-300 border border-border hover:border-indigo-500/50"
            >
              <div className="flex gap-4">
                <div className="text-4xl flex-shrink-0">{feature.icon}</div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
