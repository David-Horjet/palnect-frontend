"use client"

import Link from "next/link"
import { Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section id="home" className="relative z-10 overflow-hidden pt-44 md:pt-48 xl:pt-56 px-4 sm:px-8 xl:px-0">
      <div className="mx-auto max-w-7xl">
        {/* Background blur elements */}
        <div className="pointer-events-none absolute inset-0 -z-10 -mx-28 overflow-hidden">
          <div
            className="absolute -top-[128%] left-1/2 -z-10 h-[1282px] w-full max-w-[1282px] -translate-x-1/2 rounded-full sm:-top-[107%] xl:-top-[73%]"
            style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%)" }}
          />
          <div
            className="absolute -top-[112%] left-1/2 -z-10 h-[1046px] w-full max-w-[1046px] -translate-x-1/2 rounded-full sm:-top-[93%] xl:-top-[62%]"
            style={{ background: "radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)" }}
          />
        </div>

        <div className="relative z-1 mx-auto max-w-[900px]">
          <div className="text-center">
            {/* Badge */}
            <span className="relative mb-5 inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-sm font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-colors">
              <Zap size={16} className="text-purple-400" />
              <span className="text-white/80">Launch Your Mentorship Journey</span>
            </span>

            {/* Heading */}
            <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Connect with Mentors, <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                Unlock Your Potential
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mb-9 max-w-[600px] font-medium text-gray-300 md:text-lg leading-relaxed">
              Join a thriving community of mentors and mentees. Access premium resources, get personalized guidance, and
              accelerate your growth with AI-powered learning tools.
            </p>

            {/* CTA Button */}
            <Link
              href="/signup"
              className="inline-flex rounded-lg px-8 py-4 font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
