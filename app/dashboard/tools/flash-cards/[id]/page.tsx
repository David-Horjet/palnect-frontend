"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { fetchFlashcardDeck } from "@/store/slices/toolsSlice"

export default function FlashcardStudyPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const { currentDeck, loading } = useSelector((state: RootState) => state.tools)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    if (params.id && token) {
      dispatch(fetchFlashcardDeck({ token, deckId: params.id as string }))
    }
  }, [dispatch, params.id, token])

  const nextCard = () => {
    if (!currentDeck) return
    setCurrentIndex((prev) => (prev + 1) % currentDeck.flashcards.length)
    setIsFlipped(false)
  }

  const prevCard = () => {
    if (!currentDeck) return
    setCurrentIndex((prev) => (prev - 1 + currentDeck.flashcards.length) % currentDeck.flashcards.length)
    setIsFlipped(false)
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextCard()
    if (e.key === 'ArrowLeft') prevCard()
    if (e.key === ' ') {
      e.preventDefault()
      flipCard()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentDeck])

  if (loading) {
    return (
      <div className="flex h-screen">
        <DashboardSidebar activeTab="tools" />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
      </div>
    )
  }

  if (!currentDeck || currentDeck.flashcards.length === 0) {
    return (
      <div className="flex h-screen">
        <DashboardSidebar activeTab="tools" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No flashcards found</h2>
            <Button onClick={() => router.push('/dashboard/tools/flash-cards')}>
              Back to Decks
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const currentCard = currentDeck.flashcards[currentIndex]
  const progress = ((currentIndex + 1) / currentDeck.flashcards.length) * 100

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="tools" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title={currentDeck.title} subtitle="Study your flashcards" />

        <div className="p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/tools/flash-cards')}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Decks
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {currentDeck.flashcards.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-6">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Flashcard */}
          <div className="mb-6">
            <div
              className="relative h-64 cursor-pointer"
              onClick={flipCard}
              style={{ perspective: '1000px' }}
            >
              <div
                className="relative w-full h-full transition-transform duration-700"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <Card className="w-full h-full flex items-center justify-center p-6">
                    <div className="text-center">
                      <p className="text-lg font-medium">{currentCard.front}</p>
                      <p className="text-sm text-muted-foreground mt-4">Click to flip</p>
                    </div>
                  </Card>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <Card className="w-full h-full flex items-center justify-center p-6">
                    <div className="text-center">
                      <p className="text-lg font-medium">{currentCard.back}</p>
                      <p className="text-sm text-muted-foreground mt-4">Click to flip</p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button variant="outline" onClick={flipCard} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Flip
            </Button>

            <Button
              onClick={nextCard}
              disabled={currentIndex === currentDeck.flashcards.length - 1}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Use arrow keys or buttons to navigate • Spacebar to flip</p>
            {currentIndex === 0 && <p className="mt-2">First card reached</p>}
            {currentIndex === currentDeck.flashcards.length - 1 && <p className="mt-2">Last card reached</p>}
          </div>
        </div>
      </main>
    </div>
  )
}

  