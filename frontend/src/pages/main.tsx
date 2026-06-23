import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../css/index.css'
import App from './App.tsx'
import { AuthProvider } from '../auth/AuthContext.tsx'
import { LanguageProvider } from '../i18n/LanguageContext.tsx'
import { GameUniverseProvider } from '../context/GameUniverseContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <GameUniverseProvider>
          <App />
        </GameUniverseProvider>
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>,
)
