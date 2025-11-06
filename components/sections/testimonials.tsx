"use client"

import { Card } from "@/components/ui/card"

interface Testimonial {
  quote: string
  author: string
  role: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    quote: "Palnect transformed my career. The mentorship I received was invaluable and the resources are top-notch.",
    author: "Emma Wilson",
    role: "Junior Developer",
    avatar: "👩‍🎓",
  },
  {
    quote: "The platform is incredibly user-friendly and the community is so supportive. Highly recommended!",
    author: "Marcus Lee",
    role: "Product Designer",
    avatar: "👨‍🎨",
  },
  {
    quote: "I've grown so much in just 6 months. The AI tools really help personalize my learning experience.",
    author: "Priya Sharma",
    role: "Data Scientist",
    avatar: "👩‍🔬",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="space-y-4 text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold">Loved by Learners</h2>
          <p className="text-lg text-muted-foreground">
            Real stories from real people who've transformed their careers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="p-8 hover:shadow-lg transition-all duration-300">
              <div className="space-y-6">
                {/* Quote */}
                <p className="text-foreground leading-relaxed italic">"{testimonial.quote}"</p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
