import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

const STAGE_LABELS: Record<string, string> = {
  analyzing_prompt: "Analyzing content",
  generating_script: "Writing script",
  preparing_assets: "Preparing visuals",
  rendering_video: "Rendering video",
  finalizing: "Finalizing",
}

export function GenerationProgress() {
  const job = useSelector(
    (state: RootState) => state.generation.activeJob
  )

  const [displayProgress, setDisplayProgress] = useState(0)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!job) return

    const start = displayProgress
    const end = job.progress
    const duration = 600 // ms
    const startTime = performance.now()

    const animate = (time: number) => {
      const elapsed = time - startTime
      const progress = Math.min(elapsed / duration, 1)
      const value = Math.round(start + (end - start) * progress)

      setDisplayProgress(value)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [job?.progress])

  if (!job) return null

  const fluidHeight = `${displayProgress}%`

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Glass video-sized container */}
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg">

        {/* Fluid fill */}
        <div
          className="absolute bottom-0 left-0 w-full transition-[height] duration-500 ease-out"
          style={{ height: fluidHeight }}
        >
          <div className="w-full h-full bg-linear-to-t from-primary/60 via-primary/40 to-primary/20 blur-[1px]" />
        </div>

        {/* Overlay content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {STAGE_LABELS[job.stage] || job.stage}
          </p>

          <div className="text-4xl font-semibold font-mono">
            {displayProgress}%
          </div>

          {job.type === "video" && (
            <p className="text-xs text-muted-foreground">
              Est. {job.estimatedDuration
                ? `${job.estimatedDuration}s`
                : "—"}
            </p>
          )}

          {job.status === "failed" && (
            <p className="text-xs text-destructive">
              {job.error}
            </p>
          )}
        </div>

        {/* Subtle glass highlight */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
      </div>
    </div>
  )
}
