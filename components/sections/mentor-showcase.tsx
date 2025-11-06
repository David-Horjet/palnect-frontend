"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Mentor {
  name: string
  title: string
  expertise: string[]
  rating: number
  image: string
}

const mentors: Mentor[] = [
  {
    name: "Sarah Chen",
    title: "Senior Frontend Engineer",
    expertise: ["React", "TypeScript", "Next.js"],
    rating: 4.9,
    image: "👩‍💻",
  },
  {
    name: "Alex Rodriguez",
    title: "Full Stack Developer",
    expertise: ["Node.js", "MongoDB", "AWS"],
    rating: 4.8,
    image: "👨‍💻",
  },
  {
    name: "Jordan Kim",
    title: "Product Manager",
    expertise: ["Product Strategy", "UX Research", "Analytics"],
    rating: 4.7,
    image: "👩‍🔬",
  },
]

export function MentorShowcase() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="space-y-4 text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold">Meet Expert Mentors</h2>
          <p className="text-lg text-muted-foreground">
            Learn from professionals who are actively working in their fields.
          </p>
        </div>

        {/* Mentor Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {mentors.map((mentor, idx) => (
            <Card key={idx} className="p-8 hover:shadow-lg transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">{mentor.image}</div>
                <h3 className="text-xl font-bold">{mentor.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">{mentor.title}</p>

                {/* Rating */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold">{mentor.rating}</span>
                </div>

                {/* Expertise */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {mentor.expertise.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Connect Button */}
                <button className="w-full mt-6 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">
                  Connect
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
