// ✅ Keep your original file — zero changes needed
import API from './axios'

export const loginUser = async ({ username, password }) => {
  const response = await API.post('/auth/login', { username, password })
  return response.data
}

export const logoutUser = async () => {
  const response = await API.get('/auth/logout')
  return response.data
}

export const refreshToken = async () => {
  const response = await API.post('/auth/refreshAccessToken')
  return response.data
}