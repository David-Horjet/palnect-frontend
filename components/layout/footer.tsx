"use client"

import Link from "next/link"
import { Facebook, Twitter, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative z-10 pb-20 lg:pb-28 xl:pb-36 px-4 sm:px-8 xl:px-0">
      <div className="absolute bottom-0 left-0 -z-1 flex w-full flex-col gap-3 opacity-20">
        <div
          className="h-[1.24px] w-full"
          style={{ background: "linear-gradient(to right, transparent, rgba(168, 85, 247, 0.5), transparent)" }}
        />
        <div
          className="h-[2.47px] w-full"
          style={{ background: "linear-gradient(to right, transparent, rgba(168, 85, 247, 0.5), transparent)" }}
        />
        <div
          className="h-[3.71px] w-full"
          style={{ background: "linear-gradient(to right, transparent, rgba(168, 85, 247, 0.5), transparent)" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1170px]">
        {/* Top border */}
        <div
          className="absolute left-0 top-0 h-[1px] w-full"
          style={{ background: "linear-gradient(to right, transparent, rgba(168, 85, 247, 0.3), transparent)" }}
        />

        <div className="pt-20 lg:pt-28">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-12 mb-12">
            {/* Brand section */}
            <div className="max-w-[520px]">
              <Link href="/" className="mb-8.5 inline-block">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                  Palnect
                </span>
              </Link>
              <p className="mb-12 text-gray-400 xl:w-4/5">
                Build your mentorship network and unlock your potential. Connect with expert mentors, access premium
                resources, and accelerate your growth.
              </p>
              <div className="flex items-center gap-5">
                <Link
                  href="#"
                  aria-label="facebook"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                >
                  <Facebook size={24} />
                </Link>
                <Link
                  href="#"
                  aria-label="twitter"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                >
                  <Twitter size={24} />
                </Link>
                <Link
                  href="#"
                  aria-label="github"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                >
                  <Github size={24} />
                </Link>
              </div>
            </div>

            {/* Links columns */}
            <div className="flex gap-8 sm:gap-12 flex-wrap">
              {/* Products */}
              <div>
                <h4 className="mb-6 font-semibold text-white text-sm">Products</h4>
                <ul className="space-y-4">
                  {["Features", "Integrations", "Pricing", "Changes log", "Roadmap"].map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="mb-6 font-semibold text-white text-sm">Company</h4>
                <ul className="space-y-4">
                  {["Privacy Policy", "Refund Policy", "Support", "Community"].map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="mb-6 font-semibold text-white text-sm">Support</h4>
                <ul className="space-y-4">
                  {["Features", "Integrations", "Pricing", "Changes log", "Roadmap"].map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8">
            <p className="text-sm text-gray-400">Palnect, LLC. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
