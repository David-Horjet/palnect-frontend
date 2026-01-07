import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type JobStatus = "queued" | "processing" | "completed" | "failed"

export type JobStage =
  | "queued"
  | "analyzing_prompt"
  | "generating_script"
  | "preparing_assets"
  | "rendering_video"
  | "finalizing"
  | "completed"
  | "failed"

export interface GenerationJobState {
  jobId: string
  type: "text" | "video"
  status: JobStatus
  stage: JobStage
  progress: number
  message?: string
  estimatedDuration?: number
  videoUrl?: string
  error?: string
}

interface GenerationState {
  activeJob: GenerationJobState | null
}

const initialState: GenerationState = {
  activeJob: null,
}

const generationSlice = createSlice({
  name: "generation",
  initialState,
  reducers: {
    jobStarted: (state, action: PayloadAction<GenerationJobState>) => {
      state.activeJob = action.payload
    },

    jobProgressUpdated: (
      state,
      action: PayloadAction<{
        status: JobStatus
        stage: JobStage
        progress: number
        message?: string
      }>
    ) => {
      if (!state.activeJob) return
      Object.assign(state.activeJob, action.payload)
    },

    jobCompleted: (
      state,
      action: PayloadAction<{ videoUrl?: string }>
    ) => {
      if (!state.activeJob) return
      state.activeJob.status = "completed"
      state.activeJob.stage = "completed"
      state.activeJob.progress = 100
      state.activeJob.videoUrl = action.payload.videoUrl
    },

    jobFailed: (state, action: PayloadAction<{ error: string }>) => {
      if (!state.activeJob) return
      state.activeJob.status = "failed"
      state.activeJob.stage = "failed"
      state.activeJob.error = action.payload.error
    },

    clearJob: (state) => {
      state.activeJob = null
    },
  },
})

export const {
  jobStarted,
  jobProgressUpdated,
  jobCompleted,
  jobFailed,
  clearJob,
} = generationSlice.actions

export default generationSlice.reducer
