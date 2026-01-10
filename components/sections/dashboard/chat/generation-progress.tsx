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
    const [showVideo, setShowVideo] = useState(false)
    const animationRef = useRef<number | null>(null)
    const waveRef = useRef<HTMLDivElement>(null)

    // Count-up progress animation
    useEffect(() => {
        if (!job) return

        const start = displayProgress
        const end = job.progress
        const duration = 600
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

        if (animationRef.current) cancelAnimationFrame(animationRef.current)
        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [job?.progress])

    // Wave animation for fluid
    useEffect(() => {
        let waveAnimation: number
        const waveSpeed = 0.03
        let offset = 0

        const animateWave = () => {
            if (waveRef.current) {
                waveRef.current.style.backgroundPosition = `${offset}px 0`
                offset += 1 * waveSpeed * 100
            }
            waveAnimation = requestAnimationFrame(animateWave)
        }

        waveAnimation = requestAnimationFrame(animateWave)
        return () => cancelAnimationFrame(waveAnimation)
    }, [])

    if (!job) return null

    const fluidHeight = `${displayProgress}%`

    return (
        <div className="w-full max-w-lg relative">
            {/* Glass video-sized container */}
            <div className={`relative aspect-video rounded-2xl overflow-hidden border border-white/20 bg-transparent backdrop-blur-xl shadow-lg transition-opacity duration-500 ${showVideo ? "opacity-0" : "opacity-100"}`}>

                {/* Fluid fill with wave + shimmer */}
                <div
                    className="absolute bottom-0 left-0 w-full transition-[height] duration-500 ease-out overflow-hidden"
                    style={{ height: fluidHeight }}
                >
                    <div
                        ref={waveRef}
                        className="w-[200%] h-full bg-linear-to-t from-primary/70 via-primary/50 to-primary/30 animate-wave"
                        style={{
                            backgroundSize: "200% 100%",
                            filter: "blur(1px)",
                        }}
                    />
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
                            Est. {job.estimatedDuration ? `${job.estimatedDuration}s` : "—"}
                        </p>
                    )}

                    {job.status === "failed" && (
                        <p className="text-xs text-destructive">{job.error}</p>
                    )}
                </div>

                {/* Glass highlight */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
            </div>
        </div>
    )
}
