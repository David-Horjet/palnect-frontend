"use client"

import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { CtaSection } from "@/components/sections/cta"
import { FaqSection } from "@/components/sections/faq"
import { FeaturesSection } from "@/components/sections/features"
import { HeroSection } from "@/components/sections/hero"

export default function Home() {
  return (
    <div className="min-h-screen">
      <section
        className=" text-white h-screen overflow-hidden bg-foreground/5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url(/images/herobg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navbar />
        <HeroSection />
      </section>
      <FeaturesSection />
      <CtaSection />
      <FaqSection />
      {/* <NewsletterSection /> */}
      <Footer />
    </div>
  )
}
