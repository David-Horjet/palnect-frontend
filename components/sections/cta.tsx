"use client"

import Link from "next/link"
import { Zap } from "lucide-react"

export function CtaSection() {
  return (
    <section className="px-4 sm:px-8 xl:px-0">
      <div className="mx-auto max-w-[1170px]">
        <div className="cta-box-gradient relative z-50 overflow-hidden rounded-[30px] bg-black/60 px-4 py-20 lg:py-25 border border-purple-500/20">
          {/* Grid background */}
          <div
            className="absolute bottom-0 left-0 -z-1 h-full w-full opacity-30"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h1v1H0zM5 0h1v1H5zM10 0h1v1H10zM15 0h1v1H15zM20 0h1v1H20zM25 0h1v1H25zM30 0h1v1H30zM35 0h1v1H35zM0 5h1v1H0zM5 5h1v1H5zM10 5h1v1H10zM15 5h1v1H15zM20 5h1v1H20zM25 5h1v1H25zM30 5h1v1H30zM35 5h1v1H35z" fill="%23a855f7" fillOpacity="0.1"/%3E%3C/svg%3E")',
              backgroundSize: "40px 40px",
            }}
          />

          {/* Blur effects */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div
              className="absolute bottom-0 left-1/2 -z-1 h-full w-full -translate-x-1/2"
              style={{ background: "radial-gradient(circle at center, rgba(168, 85, 247, 0.15), transparent)" }}
            />
          </div>

          <div className="wow fadeInUp text-center">
            <span className="relative mb-4 inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-sm font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-colors">
              <Zap size={16} className="text-purple-400" />
              <span className="text-white/80">Try our tool for Free</span>
            </span>

            <h2 className="mb-4.5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
              What are you waiting for?
            </h2>

            <p className="mx-auto mb-9 max-w-[714px] font-medium text-gray-300">
              Build your mentorship network and unlock your potential. Join Palnect today and connect with expert
              mentors in your field.
            </p>

            <Link
              href="/signup"
              className="inline-flex rounded-lg px-8 py-4 font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
