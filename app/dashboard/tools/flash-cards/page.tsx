"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { Plus, BookOpen, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/lib/toast"

interface FlashcardDeck {
  id: string
  title: string
  created_at: string
  flashcards: { count: number }
}

export default function FlashcardsPage() {
  const router = useRouter()
  const { token } = useAuth()
  const [decks, setDecks] = useState<FlashcardDeck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDecks()
  }, [])

  const fetchDecks = async () => {
    try {
      const response = await apiClient.get<{ data: FlashcardDeck[] }>('/tools/flash-cards', token || undefined)
      setDecks(response.data)
    } catch (error) {
      console.error('Failed to fetch flashcard decks:', error)
      toast.error('Failed to load flashcard decks')
    } finally {
      setLoading(false)
    }
  }

  const deleteDeck = async (deckId: string) => {
    if (!confirm('Are you sure you want to delete this flashcard deck?')) return

    try {
      await apiClient.delete(`/tools/flash-cards/${deckId}`, token || undefined)
      setDecks(decks.filter(deck => deck.id !== deckId))
      toast.success('Flashcard deck deleted successfully')
    } catch (error) {
      console.error('Failed to delete deck:', error)
      toast.error('Failed to delete flashcard deck')
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

          {decks.length === 0 ? (
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
              {decks.map((deck) => (
                <Card key={deck.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteDeck(deck.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{deck.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {deck.flashcards?.count || 0} cards
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