import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx'
import '@fontsource/poppins';
import '@fontsource/montserrat';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <HelmetProvider>
            <App />
        </HelmetProvider>
  </StrictMode>,
)
