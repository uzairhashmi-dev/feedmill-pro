import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import {
  fetchProfile, updateProfileApi, changePasswordApi,
} from '../api/settingService'

// ── Load Profile
export const loadProfile = createAsyncThunk(
  'setting/loadProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchProfile()
      if (res.success) return res.user
      return rejectWithValue('Failed to load profile')
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ── Update Profile
export const updateProfile = createAsyncThunk(
  'setting/updateProfile',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await updateProfileApi(formData)
      if (res.success) {
        toast.success('Profile updated successfully!')
        dispatch(loadProfile())
        window.dispatchEvent(new Event('profile:updated'))
        return true
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
      return rejectWithValue('Update failed')
    }
  }
)

// ── Change Password
export const changePassword = createAsyncThunk(
  'setting/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const res = await changePasswordApi(data)
      if (res.success) {
        toast.success('Password changed successfully!')
        return true
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
      return rejectWithValue('Password change failed')
    }
  }
)

const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    profile:         null,
    loadingProfile:  false,
    updatingProfile: false,
    changingPassword: false,
    error:           null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // load
      .addCase(loadProfile.pending,   (state) => { state.loadingProfile = true;  state.error = null })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.loadingProfile = false
        state.profile        = action.payload
      })
      .addCase(loadProfile.rejected,  (state, action) => {
        state.loadingProfile = false; state.error = action.payload
        toast.error('Failed to load profile')
      })
      // update
      .addCase(updateProfile.pending,   (state) => { state.updatingProfile = true })
      .addCase(updateProfile.fulfilled, (state) => { state.updatingProfile = false })
      .addCase(updateProfile.rejected,  (state) => { state.updatingProfile = false })
      // password
      .addCase(changePassword.pending,   (state) => { state.changingPassword = true })
      .addCase(changePassword.fulfilled, (state) => { state.changingPassword = false })
      .addCase(changePassword.rejected,  (state) => { state.changingPassword = false })
  },
})

// ── Selectors
export const selectProfile          = (s) => s.setting?.profile          ?? null
export const selectLoadingProfile   = (s) => s.setting?.loadingProfile   ?? false
export const selectUpdatingProfile  = (s) => s.setting?.updatingProfile  ?? false
export const selectChangingPassword = (s) => s.setting?.changingPassword ?? false

export default settingSlice.reducer