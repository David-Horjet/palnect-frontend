"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-pink-600 p-12 md:p-20 text-center">
          {/* Gradient overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          <div className="relative space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to Start Learning?</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Join thousands of students and mentors transforming their careers on Palnect.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                variant="primary"
                size="lg"
                className="px-8 py-3 text-base font-semibold rounded-full bg-white text-indigo-600 hover:bg-gray-100"
              >
                <Link href="/signup">Create Free Account</Link>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="px-8 py-3 text-base font-semibold rounded-full border-2 border-white text-white hover:bg-white/10"
              >
                <Link href="#">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
