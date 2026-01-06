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

    return (
        <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
            <p className="text-sm font-medium">
                {STAGE_LABELS[job.stage] || job.stage}
            </p>

            {/* <Progress value={job.progress} /> */}

            <p className="text-xs text-muted-foreground">
                {job.progress}% complete
            </p>

            {job.status === "failed" && (
                <p className="text-xs text-destructive">{job.error}</p>
            )}
        </div>
    )
}
