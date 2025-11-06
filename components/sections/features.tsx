"use client"

import { Zap, Users, Brain, Trophy, MessageSquare, FileText } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "OpenAI Integration",
    description: "Our AI writing tool analyzes your content, suggests improvements",
  },
  {
    icon: Users,
    title: "Next.js 13, React 18, TS",
    description: "Say goodbye to embarrassing typos and grammar mistakes",
  },
  {
    icon: Brain,
    title: "Auth, DB, Sanity Blog",
    description: "Originality is key, and our AI writing tool helps you maintain it",
  },
  {
    icon: Trophy,
    title: "Premium Dashboard",
    description: "Track your progress and achievements with advanced analytics",
  },
  {
    icon: MessageSquare,
    title: "Real-time Collaboration",
    description: "Work together with your team seamlessly in real-time",
  },
  {
    icon: FileText,
    title: "Content Management",
    description: "Manage all your content in one centralized location",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 overflow-hidden pt-20 lg:pt-28 xl:pt-36 px-4 sm:px-8 xl:px-0">
      <div className="mx-auto max-w-[1222px]">
        {/* Header */}
        <div className="relative z-10 mb-16 text-center">
          <span className="relative mb-4 inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-sm font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-colors">
            <Zap size={16} className="text-purple-400" />
            <span className="text-white/80">Main Features</span>
          </span>
          <h2 className="mb-4.5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">Key Features of Palnect</h2>
          <p className="mx-auto max-w-[714px] font-medium text-gray-300">
            A Complete Solution for Mentorship and Learning
          </p>
        </div>

        {/* Features Grid */}
        <div className="relative">
          <div className="flex flex-wrap justify-center">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="w-full sm:w-1/2 lg:w-1/3">
                  <div className="group relative overflow-hidden px-4 py-8 text-center sm:py-10 lg:px-8 xl:px-13 xl:py-15 hover:bg-white/5 transition-all duration-300">
                    {/* Background gradient on hover */}
                    <span
                      className="absolute left-0 top-0 -z-1 h-full w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "radial-gradient(circle at center, rgba(168, 85, 247, 0.1), transparent)" }}
                    />

                    {/* Icon container */}
                    <div className="relative mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-300">
                      <Icon size={32} className="text-purple-400" />
                    </div>

                    {/* Content */}
                    <h3 className="mb-4 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="font-medium text-gray-400">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
