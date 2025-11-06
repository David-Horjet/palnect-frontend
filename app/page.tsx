"use client"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/navbar"
import { CtaSection } from "@/components/sections/cta"
import { FeaturesSection } from "@/components/sections/features"
import { HeroSection } from "@/components/sections/hero"
import { NewsletterSection } from "@/components/sections/newsletter"


export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
      <NewsletterSection />
      <Footer />
    </div>
  )
}
