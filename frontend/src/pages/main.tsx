import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../css/index.css'
import App from './App.tsx'
import { AuthProvider } from '../auth/AuthContext.tsx'
import { LanguageProvider } from '../i18n/LanguageContext.tsx'
import { GameUniverseProvider } from '../context/GameUniverseContext.tsx'
import { SocialSocketProvider } from '@/context/SocialSocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SocialSocketProvider>
        <LanguageProvider>
          <GameUniverseProvider>
            <App />
          </GameUniverseProvider>
        </LanguageProvider>
      </SocialSocketProvider>
    </AuthProvider>
  </StrictMode>,
)
