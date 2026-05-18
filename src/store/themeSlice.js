import { createSlice } from '@reduxjs/toolkit'

const applyThemeToDOM = (mode) => {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', mode)
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: 'dark',
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      applyThemeToDOM(state.mode)
    },
    setTheme: (state, action) => {
      state.mode = action.payload
      applyThemeToDOM(state.mode)
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export const selectThemeMode = (state) => state.theme.mode
export default themeSlice.reducer