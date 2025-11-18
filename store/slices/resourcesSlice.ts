import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { resourcesService, type Resource } from "@/services/api/resources"
import { toast } from "@/lib/toast"
import { aiService } from "@/services/api/ai"

interface ResourcesState {
    resources: Resource[]
    myResources: Resource[]
    currentResource: Resource | null
    loading: boolean
    error: string | null
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
    aiSummary: { summary: string; provider: string } | null
    aiSummaryLoading: boolean
}

const initialState: ResourcesState = {
    resources: [],
    myResources: [],
    currentResource: null,
    loading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
    },
    aiSummary: null,
    aiSummaryLoading: false,
}

export const listResources = createAsyncThunk(
    "resources/list",
    async (
        filters: {
            page?: number
            limit?: number
            category?: string
            subject?: string
            school?: string
            year?: string
            search?: string
        } = {},
        { rejectWithValue },
    ) => {
        try {
            const response = await resourcesService.listResources(filters)
            return response.data
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to fetch resources"
            return rejectWithValue(message)
        }
    },
)

export const getResource = createAsyncThunk("resources/getSingle", async (id: string, { rejectWithValue }) => {
    try {
        const response = await resourcesService.getResource(id)
        return response.data
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch resource"
        toast.error(message)
        return rejectWithValue(message)
    }
})

export const getUserResources = createAsyncThunk(
    "resources/getUserResources",
    async (
        filters: {
            page?: number
            limit?: number
        } = {},
        { rejectWithValue },
    ) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return rejectWithValue("No token found")

            const response = await resourcesService.getUserResources(token, filters)
            return response.data
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to fetch your resources"
            return rejectWithValue(message)
        }
    },
)

export const uploadResource = createAsyncThunk(
    "resources/upload",
    async (
        data: {
            file: File
            title: string
            description: string
            category: string
            subject: string
            year: string
            school: string
            department: string
        },
        { rejectWithValue },
    ) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return rejectWithValue("No token found")

            const response = await resourcesService.uploadResource(token, data.file, {
                title: data.title,
                description: data.description,
                category: data.category,
                subject: data.subject,
                year: data.year,
                school: data.school,
                department: data.department
            })

            toast.success("Resource uploaded successfully")
            return response.data
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to upload resource"
            toast.error(message)
            return rejectWithValue(message)
        }
    },
)

export const downloadResource = createAsyncThunk("resources/download", async (id: string, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token")
        if (!token) return rejectWithValue("No token found")

        await resourcesService.downloadResource(token, id)
        // toast.success("Download tracked")
        return id
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to track download"
        return rejectWithValue(message)
    }
})

export const deleteResource = createAsyncThunk("resources/delete", async (id: string, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token")
        if (!token) return rejectWithValue("No token found")

        await resourcesService.deleteResource(token, id)
        toast.success("Resource deleted successfully")
        return id
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to delete resource"
        toast.error(message)
        return rejectWithValue(message)
    }
})

export const generateAISummary = createAsyncThunk(
    "resources/generateAISummary",
    async (resourceId: string, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return rejectWithValue("No token found")
            const response = await aiService.summarizeResource(token, resourceId, "chatgpt")
            toast.success("AI summary generated successfully")
            return response.data
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to generate summary"
            toast.error(message)
            return rejectWithValue(message)
        }
    },
)

const resourcesSlice = createSlice({
    name: "resources",
    initialState,
    reducers: {
        clearCurrentResource: (state) => {
            state.currentResource = null
        },
        clearError: (state) => {
            state.error = null
        },
        clearAISummary: (state) => {
            state.aiSummary = null
        },
    },
    extraReducers: (builder) => {
        // List Resources
        builder.addCase(listResources.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(listResources.fulfilled, (state, action) => {
            state.loading = false
            state.resources = action.payload
        })
        builder.addCase(listResources.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })

        // Get Single Resource
        builder.addCase(getResource.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getResource.fulfilled, (state, action) => {
            state.loading = false
            state.currentResource = action.payload
        })
        builder.addCase(getResource.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })

        // Get User Resources
        builder.addCase(getUserResources.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getUserResources.fulfilled, (state, action) => {
            state.loading = false
            state.myResources = action.payload
        })
        builder.addCase(getUserResources.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })

        // Upload Resource
        builder.addCase(uploadResource.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(uploadResource.fulfilled, (state, action) => {
            state.loading = false
            state.myResources.unshift(action.payload)
        })
        builder.addCase(uploadResource.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })

        // Delete Resource
        builder.addCase(deleteResource.fulfilled, (state, action) => {
            state.myResources = state.myResources.filter((r: Resource) => r.id !== (action.payload as string))
        })

        // Generate AI Summary
        builder.addCase(generateAISummary.pending, (state) => {
            state.aiSummaryLoading = true
        })
        builder.addCase(generateAISummary.fulfilled, (state, action) => {
            state.aiSummaryLoading = false
            state.aiSummary = action.payload
        })
        builder.addCase(generateAISummary.rejected, (state) => {
            state.aiSummaryLoading = false
        })

    },
})

export const { clearCurrentResource, clearError, clearAISummary } = resourcesSlice.actions
export default resourcesSlice.reducer
