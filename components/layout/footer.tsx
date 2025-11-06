"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Palnect</h3>
            <p className="text-sm text-muted-foreground">Connecting mentors and learners to unlock potential.</p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Product</h4>
            <ul className="space-y-2 text-sm">
              {["Features", "Pricing", "Security", "Roadmap"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              {["About", "Blog", "Careers", "Contact"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              {["Privacy", "Terms", "Cookies", "Compliance"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">&copy; 2025 Palnect. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <Link
                key={social}
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
