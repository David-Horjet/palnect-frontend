"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Logo from "../shared/logo";

const navLinks = [
  { href: "/", label: "Home" },
  // { href: "/about", label: "About" },
  { href: "/#features", label: "Features" },
  { href: "/#faq", label: "FAQ" },
  // { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header className="fixed z-50 top-0 left-0 right-0 w-full flex justify-center pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`flex items-center justify-between bg-foreground/5 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-4 shadow-lg pointer-events-auto border border-border/10
          transition-all duration-500 ease-in-out
          ${scrolled
              ? "w-full max-w-full rounded-none shadow-md translate-y-0"
              : "w-[95%] max-w-6xl mt-6 rounded-2xl shadow-xl"
            }`}
        >
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-smooth rounded-lg ${isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Button size="md"><Link href="/auth/signin" className="flex items-center">Sign In <ArrowRight className="ml-1" size={16} /></Link></Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-border/30 transition-smooth"
              aria-label="Toggle menu"
            >
              <svg
                className="h-5 w-5 text-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12M6 12h16"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 mt-2 md:hidden bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-4 space-y-2"
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium transition-smooth rounded-lg ${isActive
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </motion.nav>
      </header>
    </>
  );
}