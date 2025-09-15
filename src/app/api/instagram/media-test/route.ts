import { NextResponse } from 'next/server';

// Dados mock para teste dos insights
const mockMediaWithInsights = [
  {
    id: "test_video_1",
    media_type: "VIDEO",
    media_url: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Test+Video",
    thumbnail_url: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Test+Video",
    permalink: "https://instagram.com/p/test1",
    caption: "🎬 Vídeo de teste para verificar insights",
    timestamp: "2024-01-15T10:30:00Z",
    insights: {
      data: [
        { name: "video_views", values: [{ value: 1250 }] },
        { name: "likes", values: [{ value: 89 }] },
        { name: "comments", values: [{ value: 12 }] },
        { name: "shares", values: [{ value: 5 }] },
        { name: "saved", values: [{ value: 23 }] },
        { name: "impressions", values: [{ value: 2100 }] },
        { name: "reach", values: [{ value: 1890 }] }
      ]
    }
  },
  {
    id: "test_reels_1",
    media_type: "REELS",
    media_url: "https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Test+Reels",
    thumbnail_url: "https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Test+Reels",
    permalink: "https://instagram.com/p/test2",
    caption: "🎭 Reels de teste para verificar insights",
    timestamp: "2024-01-14T15:45:00Z",
    insights: {
      data: [
        { name: "plays", values: [{ value: 3420 }] },
        { name: "likes", values: [{ value: 156 }] },
        { name: "comments", values: [{ value: 23 }] },
        { name: "shares", values: [{ value: 8 }] },
        { name: "saved", values: [{ value: 45 }] },
        { name: "reach", values: [{ value: 4100 }] },
        { name: "impressions", values: [{ value: 5200 }] }
      ]
    }
  },
  {
    id: "test_recent_post",
    media_type: "IMAGE",
    media_url: "https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Recent+Post",
    thumbnail_url: "https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Recent+Post",
    permalink: "https://instagram.com/p/test3",
    caption: "📸 Post recente - sem insights disponíveis",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    insightsError: {
      reason: 'RECENT_POST',
      message: 'Post muito recente',
      details: 'Publicado há 2.0 horas. Insights ficam disponíveis após 24h.'
    }
  },
  {
    id: "test_personal_account",
    media_type: "VIDEO",
    media_url: "https://via.placeholder.com/400x300/9370DB/FFFFFF?text=Personal+Account",
    thumbnail_url: "https://via.placeholder.com/400x300/9370DB/FFFFFF?text=Personal+Account",
    permalink: "https://instagram.com/p/test4",
    caption: "👤 Post de conta pessoal - insights limitados",
    timestamp: "2024-01-10T12:00:00Z",
    insightsError: {
      reason: 'PERSONAL_ACCOUNT',
      message: 'Conta pessoal',
      details: 'Insights completos só estão disponíveis para contas business.'
    }
  },
  {
    id: "test_unsupported",
    media_type: "CAROUSEL_ALBUM",
    media_url: "https://via.placeholder.com/400x300/DC143C/FFFFFF?text=Unsupported",
    thumbnail_url: "https://via.placeholder.com/400x300/DC143C/FFFFFF?text=Unsupported",
    permalink: "https://instagram.com/p/test5",
    caption: "🚫 Post com métricas não suportadas",
    timestamp: "2024-01-08T16:30:00Z",
    insightsError: {
      reason: 'UNSUPPORTED_METRIC',
      message: 'Métricas não suportadas',
      details: 'Este tipo de post não suporta as métricas solicitadas.'
    }
  }
];

export async function GET() {
  console.log('🧪 [Test Media API] Retornando dados mock com insights para teste');
  
  return NextResponse.json({
    success: true,
    data: mockMediaWithInsights,
    paging: null,
    testMode: true
  });
}