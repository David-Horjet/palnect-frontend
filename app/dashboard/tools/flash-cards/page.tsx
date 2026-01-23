"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { Plus, BookOpen, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { fetchFlashcardDecks, deleteFlashcardDeck } from "@/store/slices/toolsSlice"

export default function FlashcardsPage() {
  const router = useRouter()
  const { token } = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const { flashcardDecks, loading } = useSelector((state: RootState) => state.tools)

  useEffect(() => {
    if (token) {
      dispatch(fetchFlashcardDecks(token))
    }
  }, [dispatch, token])

  const handleDeleteDeck = (deckId: string) => {
    if (!confirm('Are you sure you want to delete this flashcard deck?')) return
    if (token) {
      dispatch(deleteFlashcardDeck({ token, deckId }))
    }
  }

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

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="tools" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="Flashcards" subtitle="Create and study interactive flashcards" />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <Button onClick={() => router.push('/dashboard/lexi')} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Deck
            </Button>
          </div>

          {flashcardDecks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No flashcard decks yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first flashcard deck by chatting with Lexi and asking for flashcards.
              </p>
              <Button onClick={() => router.push('/dashboard/lexi')}>
                Chat with Lexi
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcardDecks.map((deck) => (
                <Card key={deck.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDeck(deck.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{deck.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {deck.flashcards?.length || 0} cards
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Created {new Date(deck.created_at).toLocaleDateString()}
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => router.push(`/dashboard/tools/flash-cards/${deck.id}`)}
                  >
                    Study Now
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

  