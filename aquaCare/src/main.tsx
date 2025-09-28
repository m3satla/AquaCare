import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './frontend/styles/index.css'
import App from './frontend/components/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
