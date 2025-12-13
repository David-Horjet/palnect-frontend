"use client"

import { useTypewriter } from "@/hooks/useTypewriter"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface SummaryRendererProps {
  summary: string
  isLoading?: boolean
}

export function SummaryRenderer({ summary, isLoading = false }: SummaryRendererProps) {
  const { displayedText } = useTypewriter(summary, 15)

  const renderSummary = (text: string) => {
    return text.split("\n").map((line, idx) => {
      // Handle sections with emoji headers
      if (line.match(/^[📚🔑💡⏱️]/u)) {
        return (
          <div key={idx} className="mt-6 mb-3 font-bold text-base">
            {line}
          </div>
        )
      }

      // Handle bullet points
      if (line.startsWith("-")) {
        return (
          <div key={idx} className="ml-4 mb-2 text-sm">
            {line}
          </div>
        )
      }

      // Handle bold text (between asterisks)
      if (line.includes("**")) {
        const parts = line.split(/(\*\*[^*]+\*\*)/)
        return (
          <div key={idx} className="mb-2 text-sm">
            {parts.map((part, i) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i}>{part.slice(2, -2)}</strong>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </div>
        )
      }

      // Regular text
      if (line.trim()) {
        return (
          <div key={idx} className="mb-2 text-sm">
            {line}
          </div>
        )
      }

      return null
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-transparent border border-border/30 rounded-lg p-4 text-muted-foreground min-h-[200px]">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
          </div>
        ) : (
          <div><ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown></div>
        )}
      </div>  
    </div> 
  )
}
