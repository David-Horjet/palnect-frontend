"use client"

import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { Button } from "../ui/button"

export function CtaSection() {
  return (
    <section className="px-4 sm:px-8 xl:px-0">
      <div className="mx-auto max-w-[1170px]">
        <div className="relative z-50 overflow-hidden rounded-[30px] px-4 py-20 lg:py-25 border border-blue-500">

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
              style={{
                background:
                  "radial-gradient(circle at center, rgba(168, 85, 247, 0.15), transparent)",
              }}
            />
          </div>

          <div className="wow fadeInUp text-center">
            <span className="dark:bg-white/10 relative mb-10 inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-xs font-medium">
              <GraduationCap size={16} className="text-purple-400" />
              <span className="text-white/80">Join the Future of Student Learning</span>
            </span>

            <h2 className="mb-4.5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
              Learn Smarter. Connect. Grow.
            </h2>

            <p className="mx-auto mb-10 max-w-[714px] font-medium text-gray-300 leading-loose">
              Palnect connects students with mentors and peers, helps you access shared study resources,
              and powers your learning with AI insights all in one place.
              Your academic growth starts here.
            </p>

            <Button size="lg">
              <Link
                href="/auth/signup"
              >
                Join now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
