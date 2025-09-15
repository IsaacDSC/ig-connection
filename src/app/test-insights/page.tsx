"use client"

import Image from "next/image"
import { useInstagramMediaTest, type InstagramMedia } from "@/hooks/useInstagramMediaTest"

export default function TestInsightsPage() {
  const { media, loading, error } = useInstagramMediaTest()

  const getInsightValue = (mediaItem: InstagramMedia, metricName: string) => {
    const insight = mediaItem.insights?.data.find(insight => insight.name === metricName)
    const value = insight?.values[0]?.value || 0
    
    if (value > 0) {
      console.log(`📈 [Test Page] Métrica ${metricName}:`, value);
    }
    
    return value
  }

  const getDisplayMetrics = (mediaItem: InstagramMedia) => {
    console.log('🔍 [Test Page] Processando insights para mídia:', {
      id: mediaItem.id,
      type: mediaItem.media_type,
      hasInsights: !!mediaItem.insights,
      insightsCount: mediaItem.insights?.data?.length || 0,
      insightsData: mediaItem.insights?.data || 'N/A'
    });

    const metrics = []
    
    // Métricas comuns para todos os tipos
    const likes = getInsightValue(mediaItem, 'likes')
    const comments = getInsightValue(mediaItem, 'comments')
    const shares = getInsightValue(mediaItem, 'shares')
    const saved = getInsightValue(mediaItem, 'saved')
    
    if (mediaItem.media_type === 'VIDEO') {
      const views = getInsightValue(mediaItem, 'video_views')
      const impressions = getInsightValue(mediaItem, 'impressions')
      const reach = getInsightValue(mediaItem, 'reach')
      
      if (views > 0) metrics.push({ label: 'Visualizações', value: views })
      if (impressions > 0) metrics.push({ label: 'Impressões', value: impressions })
      if (reach > 0) metrics.push({ label: 'Alcance', value: reach })
      if (likes > 0) metrics.push({ label: 'Curtidas', value: likes })
      if (comments > 0) metrics.push({ label: 'Comentários', value: comments })
      if (shares > 0) metrics.push({ label: 'Compartilhamentos', value: shares })
      if (saved > 0) metrics.push({ label: 'Salvos', value: saved })
      
    } else if (mediaItem.media_type === 'REELS') {
      const plays = getInsightValue(mediaItem, 'plays')
      const reach = getInsightValue(mediaItem, 'reach')
      const impressions = getInsightValue(mediaItem, 'impressions')
      
      if (plays > 0) metrics.push({ label: 'Reproduções', value: plays })
      if (reach > 0) metrics.push({ label: 'Alcance', value: reach })
      if (impressions > 0) metrics.push({ label: 'Impressões', value: impressions })
      if (likes > 0) metrics.push({ label: 'Curtidas', value: likes })
      if (comments > 0) metrics.push({ label: 'Comentários', value: comments })
      if (shares > 0) metrics.push({ label: 'Compartilhamentos', value: shares })
      if (saved > 0) metrics.push({ label: 'Salvos', value: saved })
    }
    
    console.log('📊 [Test Page] Métricas finais para', mediaItem.id, ':', metrics);
    return metrics
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--ml-gray-200)' }}>
        <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--ml-gray-900)' }}>🧪 Teste de Insights - Carregando...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--ml-gray-200)' }}>
        <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--ml-gray-900)' }}>🧪 Teste de Insights - Erro</h1>
        <p style={{ color: 'var(--ml-red)' }}>{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--ml-gray-200)' }}>
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--ml-gray-900)' }}>🧪 Teste de Insights do Instagram</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {media.map((mediaItem) => (
          <div key={mediaItem.id} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="aspect-video mb-4">
              <Image
                src={mediaItem.thumbnail_url || mediaItem.media_url}
                alt="Test media"
                className="w-full h-full object-cover rounded"
                width={400}
                height={300}
              />
            </div>
            
            <h3 className="font-semibold mb-2">{mediaItem.media_type}</h3>
            <p className="text-sm text-gray-600 mb-4">{mediaItem.caption}</p>
            
            {/* Raw Insights Debug */}
            <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
              <strong>Raw Insights:</strong>
              <pre>{JSON.stringify(mediaItem.insights, null, 2)}</pre>
            </div>
            
            {/* Processed Metrics */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Métricas Processadas:</h4>
              {getDisplayMetrics(mediaItem).length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {getDisplayMetrics(mediaItem).map((metric, index) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-xs text-gray-600">{metric.label}</span>
                      <span className="text-sm font-semibold">{metric.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Nenhuma métrica encontrada</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}