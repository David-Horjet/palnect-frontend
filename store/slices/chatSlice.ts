import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { chatService, type Message, type Conversation, ConversationType } from "@/services/api/chat"
import { toast } from "@/lib/toast"

interface ChatState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  loading: boolean
  messageLoading: boolean
  error: string | null
  isTyping: boolean
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
  isTyping: false,
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
  async ({ token, type }: { token: string, type: ConversationType }, { rejectWithValue }) => {
    try {
      const response = await chatService.createConversation(token, type)
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
    { token, conversationId, clientMessageId, message, senderId }: { token: string; conversationId: string; clientMessageId: string; message: string; senderId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await chatService.sendMessage(token, conversationId, clientMessageId, message)
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
    setTyping: (state, action) => {
      state.isTyping = action.payload
    },
    updateMessageStatus: (state, action) => {
      // Accept either server messageId or clientMessageId
      const { clientMessageId, messageId, status } = action.payload

      let message = null as any

      if (clientMessageId) {
        message = state.messages.find((m) => m.id === clientMessageId)
      }

      if (!message && messageId) {
        message = state.messages.find((m) => m.id === messageId || m.client_message_id === messageId)
      }

      if (message) {
        message.status = status
      }
    },
    // Append (or merge) an incoming message from socket/server
    addIncomingMessage: (state, action) => {
      const { conversationId, message } = action.payload

      // If this message has a client_message_id then find the temporary message
      // and replace it with the server message (idempotency & status update)
      if (message.client_message_id) {
        const idx = state.messages.findIndex((m) => m.id === message.client_message_id)
        if (idx !== -1) {
          // Replace temp message with the authoritative server message
          state.messages[idx] = {
            ...message,
            isNew: message.role === 'assistant',
            status: message.role === 'user' ? 'delivered' : 'sent',
          }
          state.messageLoading = false
          return
        }
      }

      // Otherwise just append the new message
      state.messages.push({
        ...message,
        isNew: message.role === 'assistant',
        status: message.role === 'user' ? 'delivered' : 'sent',
      })

      // When an assistant message arrives, consider messageLoading finished
      if (message.role === 'assistant') {
        state.messageLoading = false
      }
    },
    markMessageAsRead: (state, action) => {
      const { messageId } = action.payload
      const message = state.messages.find((m) => m.id === messageId)
      if (message) {
        message.isNew = false
      }
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
        state.messages = action.payload.messages.map((msg) => ({
          ...msg,
          isNew: false,
        }))
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

      .addCase(sendMessage.pending, (state, action) => {
        console.log("sendMessage.pending", action)
        state.messageLoading = true
        state.error = null
        const clientMessageId = action.meta.arg.clientMessageId
        state.messages.push({
          id: clientMessageId,
          conversation_id: action.meta.arg.conversationId || "",
          role: "user",
          content: action.meta.arg.message,
          created_at: new Date().toISOString(),
          status: "sending",
          isNew: false,
          sender_id: action.meta.arg.senderId,
          is_deleted: false
        })
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messageLoading = false

        // The API returns { response, pointsDeducted, conversation } in data
        // our thunk returns response.data so action.payload may be either
        // the conversation directly (older shape) or an object containing conversation
        const payload: any = action.payload
        const conversation = payload?.conversation ?? payload

        // Defensive: if conversation has messages, update them and currentConversation
        if (conversation?.messages) {
          state.messages = conversation.messages.map((msg: Message) => ({
            ...msg,
            // user messages are delivered; assistant messages are sent
            status: msg.role === 'user' ? 'delivered' : 'sent',
            isNew: msg.role === 'assistant',
          }))
        }

        state.currentConversation = conversation
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.messageLoading = false

        // A failed send should mark the temporary client message as failed
        const clientMessageId = action?.meta?.arg?.clientMessageId
        if (clientMessageId) {
          const message = state.messages.find((m) => m.id === clientMessageId)
          if (message) {
            message.status = 'failed'
          }
        }

        state.error = (action.payload as any) || 'Failed to send message'
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

export const { clearCurrentConversation, setTyping, updateMessageStatus, addIncomingMessage, markMessageAsRead } = chatSlice.actions
export default chatSlice.reducer
