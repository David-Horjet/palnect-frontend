"use client"

import { useState } from "react"
import { Book, ChevronDown, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { faqData } from "@/data/faq"

export function FaqSection() {
    const [expandedItems, setExpandedItems] = useState<string[]>([])

    const toggleItem = (id: string) => {
        setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
    }

    return (
        <section id="faq" className="py-16 md:py-24 px-4 md:px-8 bg-background">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span className="dark:bg-white/10 relative mb-5 inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-xs font-medium">
                        <Book className="h-3 w-3 text-primary" />
                        <span className="hero-subtitle-text">FAQ</span>
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                    <p className="text-lg text-muted-foreground">
                        Find answers to common questions about Palnect and how to get the most out of our platform.
                    </p>
                </div>

                <div className="space-y-8">
                    {faqData.map((section) => (
                        <div key={section.category}>
                            <h3 className="text-xl font-semibold text-foreground mb-4">{section.category}</h3>
                            <div className="space-y-3">
                                {section.items.map((item, index) => {
                                    const itemId = `${section.category}-${index}`
                                    const isExpanded = expandedItems.includes(itemId)

                                    return (
                                        <div
                                            key={itemId}
                                            className="border border-input rounded-lg bg-card/50 hover:bg-card/80 transition-colors"
                                        >
                                            <button
                                                onClick={() => toggleItem(itemId)}
                                                className="w-full px-6 py-4 flex items-center justify-between text-left"
                                            >
                                                <span className="font-medium text-foreground pr-4">{item.question}</span>
                                                <ChevronDown
                                                    className={cn(
                                                        "w-5 h-5 text-primary shrink-0 transition-transform duration-200",
                                                        isExpanded && "rotate-180",
                                                    )}
                                                />
                                            </button>

                                            {isExpanded && (
                                                <div className="px-6 py-4 border-t border-input bg-card/30">
                                                    <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* <div className="mt-12 p-6 bg-card rounded-lg border border-input text-center">
                    <p className="text-muted-foreground mb-4">Can't find what you're looking for?</p>
                    <a
                        href="mailto:support@palnect.com"
                        className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Contact Support
                    </a>
                </div> */}
            </div>
        </section>
    )
}
