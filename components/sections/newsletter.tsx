"use client"

import type React from "react"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "../ui/button"

export function NewsletterSection() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <section className="pb-11 pt-20 sm:pt-28 xl:pt-36 px-4 sm:px-8 xl:px-0">
      <div className="mx-auto max-w-[1170px]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          {/* Left side */}
          <div className="w-full lg:max-w-[352px]">
            <h3 className="mb-2 text-2xl lg:text-3xl font-semibold text-foreground">News & Update</h3>
            <p className="font-medium text-foreground/80">Keep up to date with everything about Palnect</p>
          </div>

          {/* Right side - Form */}
          <div className="w-full lg:max-w-[534px]">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full max-w-[395px] relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none"
                  />
                  <input
                    id="newsletterEmail"
                    placeholder="Enter your Email"
                    type="email"
                    name="newsletterEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-6 pl-12 py-3.5 text-white placeholder-gray-500 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-200"
                  />
                </div>
                <Button size="lg">
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
