"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { fetchQuiz, submitQuiz, clearCurrentQuiz, clearQuizResult } from "@/store/slices/toolsSlice"

export default function QuizPage() {
    const params = useParams()
    const router = useRouter()
    const { token } = useAuth()
    const dispatch = useDispatch<AppDispatch>()
    const { currentQuiz, quizResult, loading } = useSelector((state: RootState) => state.tools)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<(number | boolean | null)[]>([])

    useEffect(() => {
        if (params.id && token) {
            dispatch(fetchQuiz({ token, quizId: params.id as string }))
        }
        return () => {
            dispatch(clearCurrentQuiz())
            dispatch(clearQuizResult())
        }
    }, [dispatch, params.id, token])

    useEffect(() => {
        if (currentQuiz?.quiz_questions) {
            setAnswers(new Array(currentQuiz.quiz_questions.length).fill(null))
        }
    }, [currentQuiz])

    const handleAnswerChange = (value: string) => {
        if (!currentQuiz) return
        const newAnswers = [...answers]
        const currentQuestion = currentQuiz.quiz_questions[currentIndex]

        if (currentQuestion.type === 'true_false') {
            newAnswers[currentIndex] = value === 'true'
        } else {
            newAnswers[currentIndex] = parseInt(value)
        }

        setAnswers(newAnswers)
    }

    const nextQuestion = () => {
        if (!currentQuiz) return
        if (currentIndex < currentQuiz.quiz_questions.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    const prevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    const handleSubmitQuiz = () => {
        if (!params.id || !token) return
        dispatch(submitQuiz({ token, quizId: params.id as string, answers }))
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

    if (!currentQuiz || currentQuiz.quiz_questions.length === 0) {
        return (
            <div className="flex h-screen">
                <DashboardSidebar activeTab="tools" />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">No quiz found</h2>
                        <Button onClick={() => router.push('/dashboard/tools/quizzes')}>
                            Back to Quizzes
                        </Button>
                    </div>
                </main>
            </div>
        )
    }

    if (quizResult) {
        return (
            <div className="flex h-screen overflow-hidden">
                <DashboardSidebar activeTab="tools" />

                <main className="flex-1 overflow-auto">
                    <DashboardHeader title="Quiz Results" subtitle={`You scored ${quizResult.score}/${quizResult.totalQuestions}`} />

                    <div className="p-6 max-w-2xl mx-auto">
                        <Card className="p-6 mb-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2">
                                    {quizResult.percentage}% Correct
                                </h2>
                                <p className="text-muted-foreground">
                                    {quizResult.score} out of {quizResult.totalQuestions} questions
                                </p>
                            </div>
                        </Card>

                        <div className="space-y-4">
                            {currentQuiz.quiz_questions.map((question, index) => {
                                const userAnswer = answers[index]
                                const correctAnswer = JSON.parse(question.correct_answer)
                                const isCorrect = userAnswer === correctAnswer

                                return (
                                    <Card key={question.id} className="p-4">
                                        <div className="flex items-start gap-3">
                                            {isCorrect ? (
                                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium mb-2">{question.question}</p>
                                                <div className="text-sm text-muted-foreground">
                                                    <p>Your answer: {
                                                        question.type === 'true_false'
                                                            ? (userAnswer ? 'True' : 'False')
                                                            : question.options?.[userAnswer as number] || 'Not answered'
                                                    }</p>
                                                    {!isCorrect && (
                                                        <p>Correct answer: {
                                                            question.type === 'true_false'
                                                                ? (correctAnswer ? 'True' : 'False')
                                                                : question.options?.[correctAnswer] || 'Unknown'
                                                        }</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>

                        <div className="flex justify-center mt-6">
                            <Button onClick={() => router.push('/dashboard/tools/quizzes')}>
                                Back to Quizzes
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    function parseOptions(options: string | string[] | null): string[] {
        if (!options) return []
        if (Array.isArray(options)) return options

        try {
            const parsed = JSON.parse(options)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }



    const currentQuestion = currentQuiz.quiz_questions[currentIndex]

    const options = parseOptions(currentQuestion.options)

    const progress = ((currentIndex + 1) / currentQuiz.quiz_questions.length) * 100
    const isLastQuestion = currentIndex === currentQuiz.quiz_questions.length - 1

    return (
        <div className="flex h-screen overflow-hidden">
            <DashboardSidebar activeTab="tools" />

            <main className="flex-1 overflow-auto">
                <DashboardHeader title={currentQuiz.title} subtitle="Answer the questions below" />

                <div className="p-6 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/dashboard/tools/quizzes')}
                            className="gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to Quizzes
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            {currentIndex + 1} of {currentQuiz.quiz_questions.length}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-muted rounded-full h-2 mb-6">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Question */}
                    <Card className="p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>

                        {currentQuestion.type === 'multiple_choice' && options.length > 0 ? (
                            <RadioGroup
                                value={answers[currentIndex]?.toString()}
                                onValueChange={handleAnswerChange}
                            >
                                {options.map((option, optionIndex) => {
                                    const optionLetter = String.fromCharCode(97 + optionIndex) // a, b, c, d...
                                    const isSelected = answers[currentIndex]?.toString() === optionIndex.toString()

                                    return (
                                        <div
                                            key={optionIndex}
                                            className={cn(
                                                "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                                                isSelected
                                                    ? "bg-primary/10 border-primary shadow-sm"
                                                    : "bg-background border-border hover:bg-muted/50"
                                            )}
                                            onClick={() => handleAnswerChange(optionIndex.toString())}
                                        >
                                            <div className={cn(
                                                "flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm transition-all",
                                                isSelected
                                                    ? "bg-primary border-primary text-primary-foreground"
                                                    : "border-muted-foreground text-muted-foreground"
                                            )}>
                                                {optionLetter.toUpperCase()}
                                            </div>
                                            <Label
                                                htmlFor={`option-${optionIndex}`}
                                                className="flex-1 cursor-pointer font-medium"
                                            >
                                                {option}
                                            </Label>
                                            <RadioGroupItem
                                                value={optionIndex.toString()}
                                                id={`option-${optionIndex}`}
                                                className="sr-only"
                                            />
                                        </div>
                                    )
                                })}
                            </RadioGroup>
                        ) : (
                            <RadioGroup
                                value={answers[currentIndex]?.toString()}
                                onValueChange={handleAnswerChange}
                            >
                                {[
                                    { value: 'true', label: 'True' },
                                    { value: 'false', label: 'False' }
                                ].map((option) => {
                                    const isSelected = answers[currentIndex]?.toString() === option.value

                                    return (
                                        <div
                                            key={option.value}
                                            className={cn(
                                                "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                                                isSelected
                                                    ? "bg-primary/10 border-primary shadow-sm"
                                                    : "bg-background border-border hover:bg-muted/50"
                                            )}
                                            onClick={() => handleAnswerChange(option.value)}
                                        >
                                            <div className={cn(
                                                "flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm transition-all",
                                                isSelected
                                                    ? "bg-primary border-primary text-primary-foreground"
                                                    : "border-muted-foreground text-muted-foreground"
                                            )}>
                                                {option.label.charAt(0)}
                                            </div>
                                            <Label
                                                htmlFor={option.value}
                                                className="flex-1 cursor-pointer font-medium"
                                            >
                                                {option.label}
                                            </Label>
                                            <RadioGroupItem
                                                value={option.value}
                                                id={option.value}
                                                className="sr-only"
                                            />
                                        </div>
                                    )
                                })}
                            </RadioGroup>
                        )}
                    </Card>

                    {/* Navigation */}
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={prevQuestion}
                            disabled={currentIndex === 0}
                            className="gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        {isLastQuestion ? (
                            <Button
                                onClick={handleSubmitQuiz}
                                disabled={answers[currentIndex] === null}
                                className="gap-2"
                            >
                                Submit Quiz
                            </Button>
                        ) : (
                            <Button
                                onClick={nextQuestion}
                                disabled={answers[currentIndex] === null}
                                className="gap-2"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

