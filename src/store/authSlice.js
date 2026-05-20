import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, logoutUser } from '../api/authService'

// ── Helpers 
const loadUserFromStorage = () => {
  try {
    const saved = localStorage.getItem('feedmill_user')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

// ── Async Thunks (same API calls as before)
export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await loginUser({ username, password })
      localStorage.setItem('feedmill_user', JSON.stringify(data))
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed'
      )
    }
  }
)
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser()
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed')
    } finally {
      localStorage.removeItem('feedmill_user')
    }
  }
)
// ── Slice 
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadUserFromStorage(),
    isAuthenticated: !!loadUserFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    // called by axios interceptor when refresh fails
    forceLogout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('feedmill_user')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login 
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // ── Logout 
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(logoutThunk.rejected, (state) => {
        // even on API failure — clear local state
        state.loading = false
        state.user = null
        state.isAuthenticated = false
      })
  },
})

export const { forceLogout, clearError } = authSlice.actions

// ── Selectors 
export const selectUser            = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading     = (state) => state.auth.loading
export const selectAuthError       = (state) => state.auth.error

export default authSlice.reducer