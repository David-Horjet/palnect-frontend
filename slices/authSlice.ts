import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  points: number
  isVerified: boolean
  createdAt: string
  username?: string
  school?: string
  department?: string
  yearOfStudy?: string
  avatarUrl?: string
  bio?: string
  isMentor?: boolean
  isAdmin?: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
}

// Async thunks
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
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.message || "Signup failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.data.token)
      return data.data
    } catch (error) {
      return rejectWithValue("Network error during signup")
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
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.message || "Login failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.data.token)
      return data.data
    } catch (error) {
      return rejectWithValue("Network error during login")
    }
  },
)

export const getProfile = createAsyncThunk("auth/getProfile", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      return rejectWithValue("No token found")
    }

    const response = await fetch("http://localhost:5000/api/auth/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      localStorage.removeItem("token")
      return rejectWithValue("Failed to fetch profile")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    return rejectWithValue("Network error during profile fetch")
  }
})

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token")
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

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer
