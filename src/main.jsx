import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { setTheme } from './store/themeSlice'
import './index.css'
import App from './App'

const savedTheme =
  localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

// Apply .dark class to <html> immediately
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
}

// Sync to Redux store so components can read it
store.dispatch(setTheme(savedTheme))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)