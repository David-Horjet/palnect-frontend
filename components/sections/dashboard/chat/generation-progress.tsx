import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
// import { Progress } from "@/components/ui/progress"

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

    if (!job) return null

    const isVideo = job.type === 'video'

    return (
        <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{STAGE_LABELS[job.stage] || job.stage}</p>
                <p className="text-sm font-mono font-semibold">{job.progress}%</p>
            </div>

            {/* Fluid style progress bar */}
            <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                <div
                    className="h-3 bg-linear-to-r from-primary to-primary/70"
                    style={{ width: `${job.progress}%`, transition: 'width 600ms ease' }}
                />
            </div>

            {isVideo && (
                <div className="text-xs text-muted-foreground">
                    Estimated: {job.estimatedDuration ? `${job.estimatedDuration}s` : '—'}
                </div>
            )}

            {job.status === "failed" && (
                <p className="text-xs text-destructive">{job.error}</p>
            )}
        </div>
    )
}
