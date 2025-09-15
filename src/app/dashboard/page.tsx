"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { mockProfile, mockVideos } from "@/lib/mockData"
import { 
  checkInstagramSession, 
  clearInstagramSession, 
  formatTokenForDisplay,
  type InstagramSession 
} from "@/lib/instagram"

interface InstagramVideo {
  id: string
  media_type: string
  media_url: string
  thumbnail_url?: string
  permalink: string
  caption?: string
  timestamp: string
  insights?: {
    data: Array<{
      name: string
      values: Array<{ value: number }>
    }>
  }
}

export default function Dashboard() {
  const [videos] = useState<InstagramVideo[]>(mockVideos)
  const [visibleVideos, setVisibleVideos] = useState(6)
  const [loadingMore, setLoadingMore] = useState(false)
  const [instagramSession, setInstagramSession] = useState<InstagramSession | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)

  // Verificar sessão do Instagram
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('🔍 Iniciando verificação de sessão Instagram...')
        setSessionLoading(true)
        
        console.log('📡 Fazendo chamada para checkInstagramSession...')
        const sessionData = await checkInstagramSession()
        
        console.log('📥 Resposta recebida:', sessionData)
        
        if (sessionData.authenticated && sessionData.data) {
          console.log('✅ Instagram session found:', {
            userId: sessionData.data.user_id,
            tokenPreview: formatTokenForDisplay(sessionData.data.access_token),
            fullResponse: sessionData
          })
          setInstagramSession(sessionData.data)
        } else {
          console.log('❌ Sessão não encontrada ou inválida:', sessionData)
          setSessionError(sessionData.message || 'Sessão do Instagram não encontrada')
        }
      } catch (error) {
        console.error('💥 Error checking Instagram session:', error)
        setSessionError('Erro ao verificar sessão do Instagram')
      } finally {
        console.log('🏁 Finalizando verificação de sessão')
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

  const loadMoreVideos = () => {
    setLoadingMore(true)
    setTimeout(() => {
      setVisibleVideos(prev => Math.min(prev + 6, videos.length))
      setLoadingMore(false)
    }, 500)
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
    })
  }

  const getInsightValue = (video: InstagramVideo, metricName: string) => {
    const insight = video.insights?.data.find(insight => insight.name === metricName)
    return insight?.values[0]?.value || 0
  }

  const displayedVideos = videos.slice(0, visibleVideos)
  const hasMoreVideos = visibleVideos < videos.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Instagram Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Status da Sessão Instagram */}
              {sessionLoading ? (
                <div className="text-sm text-gray-600">
                  Verificando sessão...
                </div>
              ) : instagramSession ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instagram Session Info */}
        {instagramSession && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-green-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Sessão Instagram Ativa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">User ID:</span>
                <p className="text-lg font-mono text-gray-900">{instagramSession.user_id}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Access Token:</span>
                <p className="text-sm font-mono text-gray-700 break-all">
                  {formatTokenForDisplay(instagramSession.access_token, 30)}
                </p>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              ✓ Token salvo com segurança nos cookies HTTP-only
            </div>
          </div>
        )}

        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">@{mockProfile.username}</h2>
              <p className="text-gray-600">Tipo: {mockProfile.account_type}</p>
              <p className="text-gray-600">Total de mídias: {mockProfile.media_count}</p>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Vídeos de Demonstração</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedVideos.map((video) => (
              <div key={video.id} className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="aspect-video">
                  {video.thumbnail_url ? (
                    <Image
                      src={video.thumbnail_url}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                      width={400}
                      height={300}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {formatDate(video.timestamp)}
                  </p>
                  {video.caption && (
                    <p className="text-sm text-gray-800 mb-3 line-clamp-3">
                      {video.caption.length > 100 
                        ? `${video.caption.substring(0, 100)}...` 
                        : video.caption}
                    </p>
                  )}
                  
                  {/* Insights */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Visualizações:</span>
                      <span className="font-semibold">{getInsightValue(video, "video_views").toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Impressões:</span>
                      <span className="font-semibold">{getInsightValue(video, "impressions").toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Alcance:</span>
                      <span className="font-semibold">{getInsightValue(video, "reach").toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Engagement:</span>
                      <span className="font-semibold">{getInsightValue(video, "engagement").toLocaleString()}</span>
                    </div>
                  </div>

                  <a
                    href={video.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200"
                  >
                    Ver Exemplo
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMoreVideos && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreVideos}
                disabled={loadingMore}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition duration-200 disabled:opacity-50"
              >
                {loadingMore ? "Carregando..." : "Carregar mais vídeos"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}