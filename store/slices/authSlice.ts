import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { authService, type User } from "@/services/api/auth"
import { toast } from "@/lib/toast"

interface AuthState {
  user: User | null
  token: string | null
  adminToken: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  isInitialized: boolean
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  adminToken: typeof window !== "undefined" ? localStorage.getItem("admin_token") : null,
  loading: false,
  error: null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
  isInitialized: false,
}

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    credentials: {
      email: string
      password: string
      firstName: string
      lastName: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.signup(
        credentials.email,
        credentials.password,
        credentials.firstName,
        credentials.lastName,
      )
      localStorage.setItem("token", response.data.token)
      toast.success(response.message)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Signup failed"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: {
      email: string
      password: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.login(credentials.email, credentials.password)
      localStorage.setItem("token", response.data.token)
      if (response.data.user.is_admin) {
        localStorage.setItem("admin_token", response.data.token)
      }
      toast.success(response.message)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const getProfile = createAsyncThunk("auth/getProfile", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      return rejectWithValue("No token found")
    }

    const response = await authService.getProfile(token)
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch profile"
    toast.error(message)
    return rejectWithValue(message)
  }
})

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    data: {
      firstName?: string
      lastName?: string
      username?: string
      school?: string
      department?: string
      yearOfStudy?: string
      bio?: string
    },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return rejectWithValue("No token found")

      const response = await authService.updateProfile(token, data)
      toast.success("Profile updated successfully")
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update profile"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const uploadAvatar = createAsyncThunk("auth/uploadAvatar", async (file: File, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")
    if (!token) return rejectWithValue("No token found")

    const response = await authService.uploadAvatar(token, file)
    toast.success("Avatar uploaded successfully")
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload avatar"
    toast.error(message)
    return rejectWithValue(message)
  }
})

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    data: {
      currentPassword: string
      newPassword: string
    },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return rejectWithValue("No token found")

      const response = await authService.changePassword(token, data.currentPassword, data.newPassword)
      toast.success(response.message)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to change password"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const verifyEmail = createAsyncThunk("auth/verifyEmail", async (token: string, { rejectWithValue }) => {
  try {
    const response = await authService.verifyEmail(token)
    toast.success(response.message)
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to verify email"
    toast.error(message)
    return rejectWithValue(message)
  }
})

export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.resendVerification(email)
      toast.success(response.message)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to resend verification"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email: string, { rejectWithValue }) => {
  try {
    const response = await authService.forgotPassword(email)
    toast.success(response.message)
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to send reset email"
    toast.error(message)
    return rejectWithValue(message)
  }
})

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    data: {
      token: string
      newPassword: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.resetPassword(data.token, data.newPassword)
      toast.success(response.message)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to reset password"
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token")
  localStorage.removeItem("admin_token")
  toast.info("Logged out successfully")
})

export const initializeAuth = createAsyncThunk("auth/initializeAuth", async (_, { rejectWithValue }) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    const adminToken = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

    if (token) {
      const response = await authService.getProfile(token)
      return { user: response.data, token, adminToken }
    }
    return rejectWithValue("No token found")
  } catch (error: unknown) {
    return rejectWithValue("Session expired")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    initializeAuthState: (state) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const adminToken = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
      state.token = token
      state.adminToken = adminToken
      state.isAuthenticated = !!token
      state.isInitialized = true
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder.addCase(signup.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    })
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
      state.isAuthenticated = false
    })

    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      if (action.payload.user.is_admin) {
        state.adminToken = action.payload.token
      }
      state.isAuthenticated = true
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
      state.isAuthenticated = false
    })

    // Get Profile
    builder.addCase(getProfile.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
      state.isAuthenticated = true
    })
    builder.addCase(getProfile.rejected, (state) => {
      state.loading = false
      state.isAuthenticated = false
      state.token = null
      state.user = null
    })

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
    })
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Upload Avatar
    builder.addCase(uploadAvatar.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(uploadAvatar.fulfilled, (state, action) => {
      state.loading = false
      if (state.user) {
        state.user.avatar_url = action.payload.avatar_url
      }
    })
    builder.addCase(uploadAvatar.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Change Password
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(changePassword.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.token = null
      state.adminToken = null
      state.isAuthenticated = false
    })

    builder.addCase(initializeAuth.pending, (state) => {
      state.loading = true
    })
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.adminToken = action.payload.adminToken
      state.isAuthenticated = true
      state.isInitialized = true
    })
    builder.addCase(initializeAuth.rejected, (state) => {
      state.loading = false
      state.token = null
      state.adminToken = null
      state.isAuthenticated = false
      state.isInitialized = true
    })
  },
})

export const { clearError, setUser, initializeAuth } = authSlice.actions
export default authSlice.reducer
