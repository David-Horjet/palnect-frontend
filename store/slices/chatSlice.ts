import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { chatService, type Message, type Conversation } from "@/services/api/chat"
import { toast } from "@/lib/toast"

interface ChatState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  loading: boolean
  messageLoading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  messageLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
}

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async ({ token, page, limit }: { token: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await chatService.getConversations(token, page, limit)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch conversations"
      return rejectWithValue(message)
    }
  },
)

export const getConversation = createAsyncThunk(
  "chat/getConversation",
  async ({ token, conversationId }: { token: string; conversationId: string }, { rejectWithValue }) => {
    try {
      const response = await chatService.getConversation(token, conversationId)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch conversation"
      return rejectWithValue(message)
    }
  },
)

export const createConversation = createAsyncThunk(
  "chat/createConversation",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const response = await chatService.createConversation(token)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create conversation"
      return rejectWithValue(message)
    }
  },
)

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { token, conversationId, message }: { token: string; conversationId: string | null; message: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await chatService.sendMessage(token, conversationId, message)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to send message"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const deleteConversation = createAsyncThunk(
  "chat/deleteConversation",
  async ({ token, conversationId }: { token: string; conversationId: string }, { rejectWithValue }) => {
    try {
      const response = await chatService.deleteConversation(token, conversationId)
      toast.success("Conversation deleted successfully")
      return conversationId
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete conversation"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearCurrentConversation: (state) => {
      state.currentConversation = null
      state.messages = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false
        console.log("Fetched Conversations Payload:", action.payload)
        state.conversations = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(getConversation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.loading = false
        state.currentConversation = action.payload
        state.messages = action.payload.messages
      })
      .addCase(getConversation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(createConversation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false
        state.currentConversation = action.payload
        state.messages = []
        state.conversations.unshift(action.payload)
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(sendMessage.pending, (state) => {
        state.messageLoading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messageLoading = false
        state.messages = action.payload.conversation.messages
        state.currentConversation = action.payload.conversation
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.messageLoading = false
        state.error = action.payload as string
      })

      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter((conv) => conv.id !== action.payload)
        if (state.currentConversation?.id === action.payload) {
          state.currentConversation = null
          state.messages = []
        }
      })
  },
})

export const { clearCurrentConversation } = chatSlice.actions
export default chatSlice.reducer
