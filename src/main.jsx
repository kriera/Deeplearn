import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initSentry, Sentry } from './infrastructure/sentry.js'
import './index.css'
import App from './App.jsx'

initSentry()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
