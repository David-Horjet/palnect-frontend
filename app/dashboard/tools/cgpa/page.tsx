"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const gradeMap: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
}

export default function CgpaPage() {
  const [step, setStep] = useState(1)
  const [level, setLevel] = useState("100")
  const [numCourses, setNumCourses] = useState(4)
  const [courses, setCourses] = useState<{ unit: number; grade: string }[]>([])
  const [errors, setErrors] = useState<string | null>(null)
  const [result, setResult] = useState<{ cgpa: number; totalUnits: number; totalPoints: number } | null>(null)

  const getCgpaClass = (cgpa: number) => {
    if (cgpa >= 4.5) return { label: "First Class", color: "text-emerald-500" }
    if (cgpa >= 3.5) return { label: "Second Class Upper", color: "text-blue-500" }
    if (cgpa >= 2.4) return { label: "Second Class Lower", color: "text-yellow-500" }
    if (cgpa >= 1.5) return { label: "Third Class", color: "text-orange-500" }
    return { label: "Pass", color: "text-red-500" }
  }


  const initCourses = (n: number) => {
    setCourses(Array.from({ length: n }).map(() => ({ unit: 3, grade: "A" })))
  }

  // initialize default courses
  if (step === 1 && courses.length !== numCourses) {
    initCourses(numCourses)
  }

  const validateStepOne = () => {
    if (![100, 200, 300, 400, 500].includes(Number(level))) {
      setErrors("Please select a valid level")
      return false
    }
    if (numCourses <= 0 || numCourses > 20) {
      setErrors("Number of courses must be between 1 and 20")
      return false
    }
    setErrors(null)
    return true
  }

  const validateCourses = () => {
    const totalUnits = courses.reduce((s, c) => s + (Number(c.unit) || 0), 0)
    if (totalUnits === 0) {
      setErrors("Total credit units must be greater than 0")
      return false
    }
    if (totalUnits > 50) {
      setErrors("Total credit units exceed the 50 unit maximum per semester")
      return false
    }
    for (const c of courses) {
      if (!c.grade || !(c.grade in gradeMap)) {
        setErrors("All courses must have valid grades (A-F)")
        return false
      }
      if (Number(c.unit) < 1 || Number(c.unit) > 5) {
        setErrors("Each course unit must be between 1 and 5")
        return false
      }
    }
    setErrors(null)
    return true
  }

  const computeCgpa = () => {
    const totalUnits = courses.reduce((s, c) => s + Number(c.unit), 0)
    const totalPoints = courses.reduce((s, c) => s + Number(c.unit) * gradeMap[c.grade], 0)
    const cgpa = totalPoints / totalUnits
    setResult({ cgpa: Number(cgpa.toFixed(2)), totalUnits, totalPoints })
    setStep(3)
  }

  function CgpaCircle({ value }: { value: number }) {
    const radius = 70
    const stroke = 10
    const normalizedRadius = radius - stroke * 2
    const circumference = normalizedRadius * 2 * Math.PI
    const progress = Math.min(value / 5, 1)
    const strokeDashoffset = circumference - progress * circumference

    return (
      <svg height={radius * 2} width={radius * 2}>
        {/* background */}
        <circle
          stroke="currentColor"
          className="text-muted/20"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* progress */}
        <circle
          stroke="currentColor"
          className="text-primary transition-all duration-700"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* value */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-foreground font-bold text-xl"
        >
          {value.toFixed(2)}
        </text>
        <text
          x="50%"
          y="62%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-muted-foreground text-xs"
        >
          / 5.00
        </text>
      </svg>
    )
  }


  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="tools" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="CGPA Calculator" subtitle="Calculate your semester CGPA (Nigerian 5.0 scale)" />

        <div className="p-6 space-y-8 max-w-5xl">
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Step {step} of 3</h2>
              {errors && <p className="text-sm text-destructive">{errors}</p>}

              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Current Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                    >
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="300">300</option>
                      <option value="400">400</option>
                      <option value="500">500</option>
                    </select>
                  </div>

                  <div>
                    <Input
                      type="number"
                      label="Number of Courses"
                      min={1}
                      max={20}
                      value={numCourses}
                      onChange={(e: any) => setNumCourses(Number(e.target.value))}
                    />
                  </div>

                  <div className="md:col-span-2 flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (validateStepOne()) setStep(2)
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Enter each course credit unit (1–5) and grade (A–F). Max total units per semester: 50.</p>

                  <div className="space-y-3">
                    {courses.map((c, idx) => (
                      <div key={idx} className="grid md:grid-cols-4 gap-3 items-center">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-foreground mb-2">Course {idx + 1} — Credit Unit</label>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            value={c.unit}
                            onChange={(e) => {
                              const v = Number(e.target.value)
                              setCourses((prev) => prev.map((p, i) => (i === idx ? { ...p, unit: v } : p)))
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Grade</label>
                          <select
                            value={c.grade}
                            onChange={(e) => {
                              const g = e.target.value
                              setCourses((prev) => prev.map((p, i) => (i === idx ? { ...p, grade: g } : p)))
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                          >
                            {Object.keys(gradeMap).map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2 text-sm text-muted-foreground">Points: {c.unit} × {gradeMap[c.grade]} = {c.unit * gradeMap[c.grade]}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button
                      onClick={() => {
                        if (validateCourses()) computeCgpa()
                      }}
                    >
                      Calculate CGPA
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && result && (() => {
                const cgpaMeta = getCgpaClass(result.cgpa)

                return (
                  <div className="space-y-6 text-center">
                    <h3 className="text-xl font-bold">Your CGPA Result</h3>

                    {/* GPA Circle */}
                    <div className="flex justify-center">
                      <CgpaCircle value={result.cgpa} />
                    </div>

                    {/* Classification */}
                    <p className={`text-lg font-semibold ${cgpaMeta.color}`}>
                      {cgpaMeta.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Nigerian 5.0 grading scale
                    </p>

                    {/* Stats */}
                    <div className="grid sm:grid-cols-3 gap-4 mt-4">
                      <Card className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Level</p>
                        <p className="text-lg font-bold">{level}</p>
                      </Card>

                      <Card className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Total Units</p>
                        <p className="text-lg font-bold">{result.totalUnits}</p>
                      </Card>

                      <Card className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Total Points</p>
                        <p className="text-lg font-bold">{result.totalPoints}</p>
                      </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap justify-center gap-3 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setStep(2)
                          setResult(null)
                        }}
                      >
                        Edit Courses
                      </Button>

                      <Button
                        onClick={() => {
                          setStep(1)
                          setResult(null)
                        }}
                      >
                        Start Over
                      </Button>
                    </div>
                  </div>
                )
              })()}



            </div>
          </Card>

          {/* <Card className="bg-muted/10 p-4">
            <h4 className="font-semibold">How CGPA is calculated</h4>
            <p className="text-sm text-muted-foreground mt-1">Total Grade Points ÷ Total Credit Units (Nigerian 5.0 scale where A=5, B=4, C=3, D=2, E=1, F=0).</p>
          </Card> */}
        </div>
      </main>
    </div>
  )
}
