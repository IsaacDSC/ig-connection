"use client"

import { useState, useEffect } from "react"
import {
  checkInstagramSession,
  clearInstagramSession,
  buildInstagramAuthUrl
} from "@/lib/instagram"
import { InstagramSession } from "@/types/instagram"
import { INSTAGRAM_CONFIG, getRedirectUri } from "@/lib/config"
import { useInstagramProfile } from "@/hooks/useInstagramProfile"
import InstagramProfileCard from "@/components/InstagramProfileCard"
import InstagramMediaGrid from "@/components/InstagramMediaGrid"

export default function Dashboard() {
  const [instagramSession, setInstagramSession] = useState<InstagramSession | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)

  const { profile, loading: profileLoading, error: profileError, refetch, authenticated } = useInstagramProfile()

  useEffect(() => {
    const checkSession = async () => {
      try {
        setSessionLoading(true)
        const sessionData = await checkInstagramSession()

        if (sessionData.authenticated && sessionData.data) {
          setInstagramSession(sessionData.data)
        } else {
          setSessionError(sessionData.message || 'Sessão do Instagram não encontrada')
        }
      } catch {
        setSessionError('Erro ao verificar sessão do Instagram')
      } finally {
        setSessionLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleClearSession = async () => {
    try {
      const result = await clearInstagramSession()

      if (result.status === 'success') {
        setInstagramSession(null)
        setSessionError('Sessão removida com sucesso')
      } else {
        setSessionError(result.message || 'Erro ao remover sessão')
      }
    } catch (error) {
      console.error('Error clearing session:', error)
      setSessionError('Erro ao remover sessão')
    }
  }

  const handleInstagramConnect = () => {
    const redirectUri = getRedirectUri(window.location.origin)
    const authUrl = buildInstagramAuthUrl(INSTAGRAM_CONFIG.CLIENT_ID || '', redirectUri)
    window.location.href = authUrl
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ml-gray-200)' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ borderColor: 'var(--ml-gray-400)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 ml-gradient-secondary rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--ml-gray-900)' }}>Instagram Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Status da Sessão Instagram */}
              {sessionLoading ? (
                <div className="text-sm text-gray-600">
                  Verificando sessão...
                </div>
              ) : instagramSession ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm ml-text-accent bg-green-50 px-3 py-1 rounded-full">
                    ✓ Conectado ao Instagram
                  </div>
                  <div className="text-xs text-gray-600">
                    User ID: {instagramSession.user_id}
                  </div>
                  <button
                    onClick={handleClearSession}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Desconectar
                  </button>
                </div>
              ) : (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  {sessionError || "Não conectado"}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile Info */}
      {/* Instagram Profile Section */}
      {profileLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-300 rounded mb-2 w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      ) : authenticated && profile ? (
        <InstagramProfileCard
          profile={profile}
          loading={profileLoading}
          onRefresh={refetch}
        />
      ) : profileError ? (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-red-900 mb-2">
                Erro ao carregar perfil
              </h2>
              <p className="text-red-700">{profileError}</p>
            </div>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      ) : !authenticated ? (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-yellow-200">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Conecte-se ao Instagram
              </h3>
              <p className="text-gray-600 mb-4">
                Faça login com sua conta do Instagram para ver seu perfil e dados
              </p>
              <button
                onClick={handleInstagramConnect}
                className="px-6 py-3 ml-gradient-secondary ml-hover-secondary text-white rounded-lg transition-colors hover:scale-105 transform duration-300"
              >
                Conectar Instagram
              </button>
            </div>
          </div>
        </div>
      ) : null}        {/* Posts do Instagram */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Posts do Instagram</h3>
        <InstagramMediaGrid initialVisibleCount={6} />
      </div>
    </div>
  )
}