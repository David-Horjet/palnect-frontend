"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { Plus, FileQuestion, Trash2, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { fetchQuizzes, deleteQuiz } from "@/store/slices/toolsSlice"

export default function QuizzesPage() {
  const router = useRouter()
  const { token } = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const { quizzes, loading } = useSelector((state: RootState) => state.tools)

  useEffect(() => {
    if (token) {
      dispatch(fetchQuizzes(token))
    }
  }, [dispatch, token])

  const handleDeleteQuiz = (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return
    if (token) {
      dispatch(deleteQuiz({ token, quizId }))
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
        <DashboardHeader title="Quizzes" subtitle="Generate and take quizzes to test your knowledge" />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <Button onClick={() => router.push('/dashboard/lexi')} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Quiz
            </Button>
          </div>

          {quizzes.length === 0 ? (
            <div className="text-center py-12">
              <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No quizzes yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first quiz by chatting with Lexi and asking for a quiz.
              </p>
              <Button onClick={() => router.push('/dashboard/lexi')}>
                Chat with Lexi
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <FileQuestion className="h-8 w-8 text-primary" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {quiz.quiz_questions?.length || 0} questions
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Created {new Date(quiz.created_at).toLocaleDateString()}
                  </p>
                  <Button
                    className="w-full gap-2"
                    onClick={() => router.push(`/dashboard/tools/quizzes/${quiz.id}`)}
                  >
                    <Play className="h-4 w-4" />
                    Take Quiz
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

  