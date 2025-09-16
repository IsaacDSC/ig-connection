"use client"

import { useState } from "react"
import Image from "next/image"
import { useInstagramMedia } from "@/hooks/useInstagramMedia"
import { InstagramMedia } from "@/types/instagram"

interface InstagramMediaGridProps {
  initialVisibleCount?: number
}

export default function InstagramMediaGrid({ initialVisibleCount = 6 }: InstagramMediaGridProps) {
  const { media, loading, error, authenticated, hasNextPage, loadMore, loadingMore } = useInstagramMedia(25)
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount)

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getInsightValue = (mediaItem: InstagramMedia, metricName: string) => {
    const insight = mediaItem.insights?.data.find(insight => insight.name === metricName)
    const value = insight?.values[0]?.value || 0
    return value
  }

  const getDisplayMetrics = (mediaItem: InstagramMedia) => {
    const metrics = []

    const likes = getInsightValue(mediaItem, 'likes')
    const comments = getInsightValue(mediaItem, 'comments')
    const shares = getInsightValue(mediaItem, 'shares')
    const saved = getInsightValue(mediaItem, 'saved')

    if (mediaItem.media_type === 'VIDEO') {
      const views = getInsightValue(mediaItem, 'video_views')
      const impressions = getInsightValue(mediaItem, 'impressions')
      const reach = getInsightValue(mediaItem, 'reach')

      metrics.push({ label: 'Visualizações', value: views, icon: 'play' })
      metrics.push({ label: 'Impressões', value: impressions, icon: 'eye' })
      metrics.push({ label: 'Alcance', value: reach, icon: 'users' })
      metrics.push({ label: 'Curtidas', value: likes, icon: 'heart' })
      metrics.push({ label: 'Comentários', value: comments, icon: 'message' })
      metrics.push({ label: 'Compartilhamentos', value: shares, icon: 'share' })
      metrics.push({ label: 'Salvos', value: saved, icon: 'bookmark' })

    } else if (mediaItem.media_type === 'REELS') {
      const plays = getInsightValue(mediaItem, 'plays')
      const reach = getInsightValue(mediaItem, 'reach')
      const impressions = getInsightValue(mediaItem, 'impressions')

      metrics.push({ label: 'Reproduções', value: plays, icon: 'play' })
      metrics.push({ label: 'Alcance', value: reach, icon: 'users' })
      metrics.push({ label: 'Impressões', value: impressions, icon: 'eye' })
      metrics.push({ label: 'Curtidas', value: likes, icon: 'heart' })
      metrics.push({ label: 'Comentários', value: comments, icon: 'message' })
      metrics.push({ label: 'Compartilhamentos', value: shares, icon: 'share' })
      metrics.push({ label: 'Salvos', value: saved, icon: 'bookmark' })

    } else if (mediaItem.media_type === 'CAROUSEL_ALBUM') {
      const impressions = getInsightValue(mediaItem, 'impressions')
      const reach = getInsightValue(mediaItem, 'reach')

      metrics.push({ label: 'Impressões', value: impressions, icon: 'eye' })
      metrics.push({ label: 'Alcance', value: reach, icon: 'users' })
      metrics.push({ label: 'Curtidas', value: likes, icon: 'heart' })
      metrics.push({ label: 'Comentários', value: comments, icon: 'message' })
      metrics.push({ label: 'Compartilhamentos', value: shares, icon: 'share' })
      metrics.push({ label: 'Salvos', value: saved, icon: 'bookmark' })

    }

    return metrics
  }

  const getMetricIcon = (iconType: string) => {
    const iconProps = "w-3 h-3 text-gray-500"
    
    switch (iconType) {
      case 'heart':
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        )
      case 'message':
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        )
      case 'share':
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
        )
      case 'bookmark':
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        )
      case 'eye':
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        )
      case 'users':
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        )
      case 'play':
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const renderMediaCard = (mediaItem: InstagramMedia, showInsightsMessages: boolean = true) => (
    <div key={mediaItem.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-video relative">
        {mediaItem.thumbnail_url || mediaItem.media_url ? (
          <Image
            src={mediaItem.thumbnail_url || mediaItem.media_url}
            alt="Instagram media"
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
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}

        {/* Media type badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 text-xs font-medium bg-black bg-opacity-70 text-white rounded-full">
            {mediaItem.media_type === 'REELS' ? 'Reels' :
              mediaItem.media_type === 'VIDEO' ? 'Vídeo' :
                mediaItem.media_type === 'CAROUSEL_ALBUM' ? 'Carrossel' : 'Mídia'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 mb-2">
          {formatDate(mediaItem.timestamp)}
        </p>

        {mediaItem.caption && (
          <p className="text-sm text-gray-800 mb-3 line-clamp-3">
            {mediaItem.caption.length > 100
              ? `${mediaItem.caption.substring(0, 100)}...`
              : mediaItem.caption}
          </p>
        )}

        {/* Insights */}
        {mediaItem.insights && (
          <div className="mb-4">
            {getDisplayMetrics(mediaItem).length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Insights
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {getDisplayMetrics(mediaItem).map((metric, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      {getMetricIcon(metric.icon)}
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-600">{metric.label}</span>
                        <span className="text-sm font-semibold text-gray-900">{metric.value.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              showInsightsMessages && (
                <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-gray-600">
                    Insights não disponíveis para este post
                  </span>
                </div>
              )
            )}
          </div>
        )}

        {/* Mensagem de erro dos insights */}
        {showInsightsMessages && !mediaItem.insights && mediaItem.insightsError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-4 h-4 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8.707-3.707a1 1 0 00-1.414 1.414L9.586 10l-1.707 1.707a1 1 0 101.414 1.414L11 11.414l1.707 1.707a1 1 0 001.414-1.414L12.414 10l1.707-1.707a1 1 0 00-1.414-1.414L11 8.586 9.293 6.879z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2 flex-1">
                <h5 className="text-sm font-medium text-red-700 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  {mediaItem.insightsError.message}
                </h5>
                {mediaItem.insightsError.details && (
                  <p className="text-xs text-red-600 mt-1">
                    {mediaItem.insightsError.details}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Se não tem insights nem erro, mostrar mensagem padrão */}
        {showInsightsMessages && !mediaItem.insights && !mediaItem.insightsError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="text-xs text-yellow-700 font-medium flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Insights não disponíveis
                </span>
                <p className="text-xs text-yellow-600 mt-1">
                  Os dados de insights podem não estar disponíveis para este post
                </p>
              </div>
            </div>
          </div>
        )}

        <a
          href={mediaItem.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full text-center bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 py-2 px-4 rounded-lg transition duration-200 font-medium"
        >
          Ver no Instagram
        </a>
      </div>
    </div>
  )

  const handleLoadMore = () => {
    const remainingLocal = media.length - visibleCount
    if (remainingLocal > 0) {
      setVisibleCount(prev => Math.min(prev + 6, media.length))
    } else if (hasNextPage && !loadingMore) {
      loadMore()
      setVisibleCount(prev => prev + 6)
    }
  }

  const displayedMedia = media.slice(0, visibleCount)
  const hasMore = visibleCount < media.length || hasNextPage

  // Separar posts com e sem insights
  const postsWithInsights = displayedMedia.filter(item => 
    item.insights && getDisplayMetrics(item).length > 0
  )
  const postsWithoutInsights = displayedMedia.filter(item => 
    !item.insights || getDisplayMetrics(item).length === 0
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-gray-50 rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-300"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-gray-900"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Conecte-se ao Instagram
        </h3>
        <p className="text-gray-600">
          Faça login para ver seus posts e insights reais do Instagram
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Erro ao carregar mídia
        </h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-gray-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhuma mídia encontrada
        </h3>
        <p className="text-gray-600">
          Você ainda não possui posts no Instagram ou eles não puderam ser carregados
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Seção: Posts sem Insights */}
      {postsWithoutInsights.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">
              Posts sem Insights ({postsWithoutInsights.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsWithoutInsights.map(mediaItem => renderMediaCard(mediaItem, false))}
          </div>
        </div>
      )}

      {/* Seção: Posts com Insights */}
      {postsWithInsights.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">
              Posts com Insights ({postsWithInsights.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsWithInsights.map(mediaItem => renderMediaCard(mediaItem, true))}
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-3 ml-gradient-secondary ml-hover-secondary text-white rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loadingMore ? "Carregando..." : "Carregar mais posts"}
          </button>
        </div>
      )}
    </>
  )
}