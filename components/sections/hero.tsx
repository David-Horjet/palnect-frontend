"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-32 px-4 sm:px-6 lg:px-8">
      {/* Background gradient elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="space-y-8 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-sm">
            <span className="text-sm font-medium text-indigo-600">✨ Welcome to Palnect</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
            <span className="block text-foreground">Connect with Mentors,</span>
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Unlock Your Potential
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join a community of learners and mentors. Access premium resources, get personalized guidance, and
            accelerate your growth with AI-powered tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="primary" size="lg" className="px-8 py-3 text-base font-semibold rounded-full">
              <Link href="/signup">Start Learning Free</Link>
            </Button>
            <Button variant="secondary" size="lg" className="px-8 py-3 text-base font-semibold rounded-full border-2">
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600">10K+</div>
              <p className="text-sm text-muted-foreground mt-2">Active Learners</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <p className="text-sm text-muted-foreground mt-2">Expert Mentors</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">1K+</div>
              <p className="text-sm text-muted-foreground mt-2">Resources</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
