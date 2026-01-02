"use client"

import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { CtaSection } from "@/components/sections/cta"
import { FaqSection } from "@/components/sections/faq"
import { FeaturesSection } from "@/components/sections/features"
import { HeroSection } from "@/components/sections/hero"
import { initializeAuth } from "@/store/slices/authSlice"
import { AppDispatch, RootState } from "@/store/store"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function Home() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (token && !isInitialized) {
      dispatch(initializeAuth()).then(() => {
        setIsInitialized(true)
      })
    } else if (!token) {
      setIsInitialized(true)
    }
  }, [dispatch, isInitialized])
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
