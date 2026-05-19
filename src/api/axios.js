import axios from 'axios'

const API = axios.create({
  baseURL: 'https://feedmil-backend.vercel.app/api',
  withCredentials: true,
})

// ── Response interceptor ──────────────────────────────────
// Same logic as before — on 401 try refresh, on fail force logout
// store is imported lazily to avoid circular dependency
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await axios.post(
          'https://feedmil-backend.vercel.app/api/auth/refreshAccessToken',
          {},
          { withCredentials: true }
        )
        return API(original)
      } catch {
        // lazy import — avoids circular dep with store
        const { store } = await import('../store/store')
        const { forceLogout } = await import('../store/authSlice')
        store.dispatch(forceLogout())
        // redirect to login
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default API