"use client"

import Link from "next/link"
import { Facebook, Twitter, Github, Instagram, Linkedin } from "lucide-react"
import Logo from "../shared/logo"

export function Footer() {
  return (
    <footer className="relative z-10 pb-20 lg:pb-28 xl:pb-36 px-4 sm:px-8 xl:px-0">
      {/* Decorative gradients */}
      <div className="absolute bottom-0 left-0 -z-1 flex w-full flex-col gap-3 opacity-20">
        <div
          className="h-[1.24px] w-full" 
          style={{ background: "linear-gradient(to right, transparent, rgba(168, 85, 247, 0.5), transparent)" }}
        />
        <div
          className="h-[2.47px] w-full" 
          style={{ background: "linear-gradient(to right, transparent, rgba(99, 96, 224, 0.5), transparent)" }}
        />
        <div
          className="h-[3.71px] w-full"
          style={{ background: "linear-gradient(to right, transparent, rgba(168, 85, 247, 0.5), transparent)" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1170px]">
        {/* Top gradient border */}
        <div
          className="absolute left-0 top-0 h-px w-full"
          style={{ background: "linear-gradient(to right, transparent, rgba(168, 85, 247, 0.3), transparent)" }}
        />

        <div className="pt-20 lg:pt-28">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-12 mb-12">
            {/* Brand Section */}
            <div className="max-w-[520px]">
              <Logo />
              <p className="my-5 mb-12 text-foreground/80 xl:w-4/5">
                Palnect helps students connect with mentors and peers, share study resources, and learn smarter with
                AI-powered insights. Join a supportive community built to elevate your academic journey.
              </p>
              <div className="flex items-center gap-5">
                <Link
                  href="https://web.facebook.com/profile.php?id=61583222502037"
                  aria-label="facebook"
                  className="text-foreground/80 hover:text-purple-400 transition-colors duration-300"
                >
                  <Facebook size={24} />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/palnect/"
                  aria-label="linkedin"
                  className="text-foreground/80 hover:text-purple-400 transition-colors duration-300"
                >
                  <Linkedin size={24} />
                </Link>
                <Link
                  href="https://x.com/palnect"
                  aria-label="twitter"
                  className="text-foreground/80 hover:text-purple-400 transition-colors duration-300"
                >
                  <Twitter size={24} />
                </Link>
                <Link
                  href="https://instagram.com/palnect"
                  aria-label="instagram"
                  className="text-foreground/80 hover:text-purple-400 transition-colors duration-300"
                >
                  <Instagram size={24} />
                </Link>
              </div>
            </div>

            {/* Links Section */}
            <div className="flex gap-8 sm:gap-12 flex-wrap">
              {/* Platform */}
              <div>
                <h4 className="mb-6 font-semibold text-foreground text-sm">Platform</h4>
                <ul className="space-y-4">
                  <li><Link href="/#features" className="text-foreground/80 hover:text-purple-400 transition-colors duration-300 text-sm">Features</Link></li>
                  <li><Link href="/dashboard/mentors" className="text-foreground/80 hover:text-purple-400 transition-colors duration-300 text-sm">Find a Mentor</Link></li>
                  <li><Link href="/dashboard/resources" className="text-foreground/80 hover:text-purple-400 transition-colors duration-300 text-sm">Resources</Link></li>
                  {/* <li><Link href="/dashboard/credits" className="text-foreground/80 hover:text-purple-400 transition-colors duration-300 text-sm">Pricing</Link></li> */}
                </ul>
              </div>

              {/* Company */}
              {/* <div>
                <h4 className="mb-6 font-semibold text-foreground text-sm">Company</h4>
                <ul className="space-y-4">
                  <li><Link href="/about" className="text-foreground/80 hover:text-purple-400 transition-colors duration-300 text-sm">About</Link></li>
                  <li><Link href="/blog" className="text-foreground/80 hover:text-purple-400 transition-colors duration-300 text-sm">Blog</Link></li>
                  <li><Link href="/careers" className="text-foreground/80 hover:text-purple-400 transition-colors duration-300 text-sm">Careers</Link></li>
                  <li><Link href="/contact" className="text-foreground/80 hover:text-purple-400 transition-colors duration-300 text-sm">Contact</Link></li>
                </ul>
              </div> */}

              {/* Legal */}
              <div>
                <h4 className="mb-6 font-semibold text-foreground text-sm">Legal</h4>
                <ul className="space-y-4">
                  <li><Link href="/legal/privacy-policy" className="text-foreground/80 hover:text-purple-400 transition-colors duration-300 text-sm">Privacy Policy</Link></li>
                  <li><Link href="/legal/terms-of-service" className="text-foreground/80 hover:text-purple-400 transition-colors duration-300 text-sm">Terms of Service</Link></li>
                  <li><Link href="/legal/content-moderation" className="text-foreground/80 hover:text-purple-400 transition-colors duration-300 text-sm">Content Moderation</Link></li>
                  <li><a href="https://chat.whatsapp.com/KjpEfuKNLEXDjg6EqwCUf3" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-purple-400 transition-colors duration-300 text-sm">Community</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 text-center lg:text-left">
            <p className="text-sm text-foreground/80">
              © {new Date().getFullYear()} Palnect. All rights reserved. Built by Horjet.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
