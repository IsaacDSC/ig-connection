"use client"

import { v4 as uuidv4 } from 'uuid'
import { INSTAGRAM_CONFIG, getRedirectUri } from "@/lib/config"

export default function Home() {
  const handleInstagramConnect = () => {
    const redirectUri = getRedirectUri(window.location.origin)
    const state = uuidv4() // Gera um UUID único para cada tentativa de conexão
    
    // Debug: Log da redirect_uri para verificação
    console.log('🔗 DEBUGGING FRONTEND AUTH REQUEST:')
    console.log('  - Window origin:', window.location.origin)
    console.log('  - Environment NEXT_PUBLIC_REDIRECT_URI:', process.env.NEXT_PUBLIC_REDIRECT_URI)
    console.log('  - Computed redirectUri:', redirectUri)
    console.log('  - State UUID:', state)
    
    const params = new URLSearchParams()
    
    params.append('force_reauth', 'true')
    params.append('client_id', INSTAGRAM_CONFIG.CLIENT_ID || '')
    params.append('redirect_uri', redirectUri)
    params.append('response_type', 'code')
    params.append('state', state)
    params.append('scope', INSTAGRAM_CONFIG.SCOPES)

    const authUrl = `${INSTAGRAM_CONFIG.BASE_AUTH_URL}?${params.toString()}`
    console.log('🔗 Full auth URL:', authUrl)
    
    window.location.href = authUrl
  }

  return (
    <div className="min-h-screen flex items-center justify-center ml-gradient-primary">
      <div className="bg-white rounded-lg ml-shadow-primary p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 ml-gradient-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Instagram Connection
            </h1>
            <p className="text-gray-600 mb-8">
              Conecte sua conta do Instagram Business para começar
            </p>
            
            <button
              onClick={handleInstagramConnect}
              className="w-full ml-gradient-secondary ml-hover-secondary text-white font-semibold py-3 px-6 rounded-lg ml-shadow-secondary transition-all duration-300 transform hover:scale-105"
            >
              Conectar com Instagram
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
