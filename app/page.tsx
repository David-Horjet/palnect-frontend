"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { SectionHeader } from "@/components/shared/section-header"
import { MentorCard } from "@/components/shared/mentor-card"
import { ResourceCard } from "@/components/shared/resource-card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
                Connect, Learn, and{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Grow with Peers
                </span>
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                Join Palnect to access quality resources, connect with mentors, and accelerate your learning journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg">
                  <Link href="/signup">Join Now</Link>
                </Button>
                <Button variant="secondary" size="lg">
                  <Link href="#explore">Explore Resources</Link>
                </Button>
              </div>
            </div>

            {/* Hero Gradient */}
            <div className="relative h-96 hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl blur-3xl opacity-30 animate-pulse" />
              <div className="relative h-full rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="explore" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="How It Works"
            description="Get started with Palnect in three simple steps"
            align="center"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Sign Up", desc: "Create your account and join our community" },
              { step: 2, title: "Explore", desc: "Browse resources and discover mentors" },
              { step: 3, title: "Grow", desc: "Learn, connect, and reach your goals" },
            ].map((item, i) => (
              <Card key={i} className="text-center" hover>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Popular Resources"
            description="Curated learning materials from our community"
            align="center"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Web Development Fundamentals",
                description: "Master the basics of HTML, CSS, and JavaScript",
                category: "Development",
                level: "beginner" as const,
                tags: ["HTML", "CSS"],
                rating: 4.8,
              },
              {
                title: "React Advanced Patterns",
                description: "Learn advanced React patterns and best practices",
                category: "Development",
                level: "advanced" as const,
                tags: ["React", "JavaScript"],
                rating: 4.9,
              },
              {
                title: "UI/UX Design Principles",
                description: "Create beautiful and functional user interfaces",
                category: "Design",
                level: "intermediate" as const,
                tags: ["Design", "Figma"],
                rating: 4.7,
              },
            ].map((resource, i) => (
              <ResourceCard key={i} {...resource} />
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="Core Features" description="Everything you need to succeed" align="center" />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Resources", desc: "Access curated study materials and notes" },
              { title: "Mentorship", desc: "Connect with experienced mentors" },
              { title: "AI Tools", desc: "Get intelligent study summaries and tips" },
            ].map((item, i) => (
              <Card key={i} hover>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Mentors */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="Meet Our Mentors" description="Learn from experienced professionals" align="center" />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                title: "Senior Frontend Engineer",
                bio: "Passionate about React and modern web development",
                expertise: ["React", "TypeScript", "Web Design"],
                rating: 4.9,
                students: 156,
                location: "San Francisco",
              },
              {
                name: "Alex Rodriguez",
                title: "Full Stack Developer",
                bio: "Building scalable applications with Node.js and databases",
                expertise: ["Node.js", "MongoDB", "AWS"],
                rating: 4.8,
                students: 132,
                location: "New York",
              },
              {
                name: "Jordan Kim",
                title: "Product Manager",
                bio: "Product strategy and user-centered design expert",
                expertise: ["Product Management", "UX Research", "Analytics"],
                rating: 4.7,
                students: 98,
                location: "Austin",
              },
            ].map((mentor, i) => (
              <MentorCard key={i} {...mentor} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="What Our Community Says" description="Real stories from real learners" align="center" />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Palnect connected me with an amazing mentor who completely transformed my career trajectory.",
                author: "Emma Wilson",
                role: "Junior Developer",
              },
              {
                quote: "The resources here are top-notch. I finally have access to quality learning materials.",
                author: "Marcus Lee",
                role: "Student",
              },
              {
                quote: "The community is incredibly supportive. I've made lifelong friends here.",
                author: "Priya Sharma",
                role: "Designer",
              },
            ].map((testimonial, i) => (
              <Card key={i} hover>
                <div className="space-y-4">
                  <p className="text-muted-foreground italic">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">Join thousands of students learning together on Palnect.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              <Link href="/signup">Create Account</Link>
            </Button>
            <Button variant="secondary" size="lg">
              <Link href="#">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Palnect</h4>
              <p className="text-sm text-muted-foreground">Connect, learn, and grow together.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Legal", links: ["Privacy", "Terms", "Contact"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">&copy; 2025 Palnect. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
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
    </div>
  )
}
