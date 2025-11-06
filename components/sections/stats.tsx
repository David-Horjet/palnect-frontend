"use client"

interface Stat {
  value: string
  label: string
  description: string
}

const stats: Stat[] = [
  {
    value: "98%",
    label: "Satisfaction Rate",
    description: "From our community members",
  },
  {
    value: "4.8★",
    label: "Average Rating",
    description: "Based on 2,500+ reviews",
  },
  {
    value: "24h",
    label: "Quick Support",
    description: "Response time from mentors",
  },
]

export function StatsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600/10 to-pink-600/10 border-y border-border">
      <div className="mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <h3 className="text-lg font-semibold">{stat.label}</h3>
              <p className="text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
