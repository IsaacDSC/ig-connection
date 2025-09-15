// Dados mock para demonstração
export const mockProfile = {
  id: "demo_user_123",
  username: "demo_instagram_user",
  account_type: "BUSINESS",
  media_count: 42,
}

export const mockVideos = [
  {
    id: "video_1",
    media_type: "VIDEO",
    media_url: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Video+1",
    thumbnail_url: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Video+1",
    permalink: "https://instagram.com/p/demo1",
    caption: "🎬 Primeiro vídeo de demonstração! Este é um exemplo de como os vídeos aparecem na aplicação. #demo #instagram #video",
    timestamp: "2024-01-15T10:30:00Z",
    insights: {
      data: [
        { name: "video_views", values: [{ value: 1250 }] },
        { name: "impressions", values: [{ value: 2100 }] },
        { name: "reach", values: [{ value: 1890 }] },
        { name: "engagement", values: [{ value: 156 }] },
      ]
    }
  },
  {
    id: "video_2", 
    media_type: "REELS",
    media_url: "https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Reels+2",
    thumbnail_url: "https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Reels+2",
    permalink: "https://instagram.com/p/demo2",
    caption: "🚀 Segundo vídeo em formato Reels! Mostrando como diferentes tipos de mídia são exibidos. #reels #content #social",
    timestamp: "2024-01-14T15:45:00Z",
    insights: {
      data: [
        { name: "video_views", values: [{ value: 3420 }] },
        { name: "impressions", values: [{ value: 5200 }] },
        { name: "reach", values: [{ value: 4100 }] },
        { name: "engagement", values: [{ value: 298 }] },
      ]
    }
  },
  {
    id: "video_3",
    media_type: "VIDEO", 
    media_url: "https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Video+3",
    thumbnail_url: "https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Video+3",
    permalink: "https://instagram.com/p/demo3",
    caption: "📊 Terceiro vídeo com insights detalhados. Demonstrando métricas de engagement e alcance para análise de performance.",
    timestamp: "2024-01-13T09:20:00Z",
    insights: {
      data: [
        { name: "video_views", values: [{ value: 890 }] },
        { name: "impressions", values: [{ value: 1560 }] },
        { name: "reach", values: [{ value: 1320 }] },
        { name: "engagement", values: [{ value: 78 }] },
      ]
    }
  },
  {
    id: "video_4",
    media_type: "REELS",
    media_url: "https://via.placeholder.com/400x300/96CEB4/FFFFFF?text=Reels+4", 
    thumbnail_url: "https://via.placeholder.com/400x300/96CEB4/FFFFFF?text=Reels+4",
    permalink: "https://instagram.com/p/demo4",
    caption: "✨ Quarto vídeo demonstrando a paginação! Este conteúdo mostra como a aplicação lida com múltiplos vídeos. #pagination",
    timestamp: "2024-01-12T14:10:00Z",
    insights: {
      data: [
        { name: "video_views", values: [{ value: 2100 }] },
        { name: "impressions", values: [{ value: 3800 }] },
        { name: "reach", values: [{ value: 2950 }] },
        { name: "engagement", values: [{ value: 187 }] },
      ]
    }
  },
  {
    id: "video_5",
    media_type: "VIDEO",
    media_url: "https://via.placeholder.com/400x300/FFEAA7/333333?text=Video+5",
    thumbnail_url: "https://via.placeholder.com/400x300/FFEAA7/333333?text=Video+5", 
    permalink: "https://instagram.com/p/demo5",
    caption: "🎯 Quinto vídeo com métricas variadas. Exemplo de como diferentes vídeos podem ter performances distintas. #analytics #data",
    timestamp: "2024-01-11T11:30:00Z",
    insights: {
      data: [
        { name: "video_views", values: [{ value: 1680 }] },
        { name: "impressions", values: [{ value: 2890 }] },
        { name: "reach", values: [{ value: 2340 }] },
        { name: "engagement", values: [{ value: 142 }] },
      ]
    }
  },
  {
    id: "video_6",
    media_type: "REELS",
    media_url: "https://via.placeholder.com/400x300/DDA0DD/FFFFFF?text=Reels+6",
    thumbnail_url: "https://via.placeholder.com/400x300/DDA0DD/FFFFFF?text=Reels+6",
    permalink: "https://instagram.com/p/demo6",
    caption: "🌟 Sexto vídeo finalizando a primeira página! Demonstração completa da interface e funcionalidades da aplicação. #demo #final",
    timestamp: "2024-01-10T16:45:00Z",
    insights: {
      data: [
        { name: "video_views", values: [{ value: 2850 }] },
        { name: "impressions", values: [{ value: 4200 }] },
        { name: "reach", values: [{ value: 3600 }] },
        { name: "engagement", values: [{ value: 234 }] },
      ]
    }
  }
]