import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./css/base.css"
import App from './App'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
