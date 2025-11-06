"use client"

interface SectionHeaderProps {
  title: string
  description?: string
  align?: "left" | "center"
}

export function SectionHeader({ title, description, align = "left" }: SectionHeaderProps) {
  return (
    <div className={`mb-8 ${align === "center" ? "text-center" : ""}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">{title}</h2>
      {description && <p className="text-lg text-muted-foreground text-balance">{description}</p>}
    </div>
  )
}
