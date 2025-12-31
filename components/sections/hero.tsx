"use client"

import Link from "next/link"
import { ArrowRight, GraduationCap } from "lucide-react"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { useAuth } from "@/hooks/useAuth"

export function HeroSection() {
  const { user, loading } = useAuth()
  console.log("HeroSection user:", user, loading)
  return (
    <section id="home" className="relative z-10 overflow-hidden pt-44 md:pt-48 xl:pt-56 px-4 sm:px-8 xl:px-0">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-1 mx-auto max-w-[900px]">
          <div className="text-center">
            {/* Badge */}
            <span className="relative mb-5 inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-sm font-medium bg-white/10 border border-border/30 hover:border-primary/50 transition-colors">
              <GraduationCap size={16} className="text-primary" />
              <span className="text-white/80">Built for Students & Mentors</span>
            </span>

            {/* Heading */}
            <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Learn Smarter. <br />
              <span className="text-primary">
                Connect. Collaborate. Grow.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mb-9 max-w-[650px] font-medium text-gray-300 md:text-lg leading-loose">
              Palnect helps students connect with peers and mentors, share resources, and supercharge learning with AI-powered study tools all in one collaborative space.
            </p>

            {/* CTA Button */}
            {loading ?
              (
                <Skeleton className="h-4 w-20" />
              ) : user ? (
                <Button size="md"><Link href="/dashboard" className="flex items-center">Dashboard <ArrowRight className="ml-1" size={16} /></Link></Button>
              ) : (
                <Button size="lg">
                  <Link href={"/auth/signup"}>
                    Join now
                  </Link>
                </Button>)}

            {/* Secondary CTA (optional) */}
            {/* <div className="mt-4">
              <Link
                href="#features"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                See How It Works ↓
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}
