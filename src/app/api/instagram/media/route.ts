import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface InstagramMedia {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  insights?: {
    data: Array<{
      name: string;
      values: Array<{ value: number }>;
    }>;
  };
}

interface RawInstagramMedia {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

export async function GET(request: NextRequest) {
  try {
    // Verificar se há cookies de sessão do Instagram
    const cookies = request.cookies;
    const userIdCookie = cookies.get('instagram_user_id');
    const accessTokenCookie = cookies.get('instagram_access_token');

    console.log('🍪 [Media API] Verificando cookies:', {
      hasUserIdCookie: !!userIdCookie,
      hasAccessTokenCookie: !!accessTokenCookie,
      userIdValue: userIdCookie?.value,
      accessTokenPreview: accessTokenCookie?.value ? 
        `${accessTokenCookie.value.substring(0, 20)}...` : 'N/A'
    });

    if (!userIdCookie || !accessTokenCookie) {
      console.log('❌ [Media API] Cookies de sessão Instagram não encontrados');
      return NextResponse.json(
        { 
          error: 'Sessão Instagram não encontrada',
          message: 'Você precisa estar logado no Instagram para acessar este recurso'
        },
        { status: 401 }
      );
    }

    const accessToken = accessTokenCookie.value;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '25';

    // URL da API do Instagram Graph para buscar mídia do usuário
    const mediaURL = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&limit=${limit}&access_token=${accessToken}`;

    console.log('🔍 [Media API] Buscando mídia do Instagram para user:', userIdCookie.value);

    // Fazer requisição para a API do Instagram
    const mediaResponse = await axios.get(mediaURL);

    if (mediaResponse.status !== 200) {
      console.error('❌ [Media API] Erro na API do Instagram:', mediaResponse.status, mediaResponse.data);
      return NextResponse.json(
        { 
          error: 'Erro da API do Instagram',
          message: 'Falha ao buscar dados de mídia'
        },
        { status: mediaResponse.status }
      );
    }

    const mediaData = mediaResponse.data;
    console.log('✅ [Media API] Mídia Instagram obtida:', {
      totalItems: mediaData.data?.length || 0,
      hasNext: !!mediaData.paging?.next
    });

    // Buscar insights para cada mídia (apenas para vídeos e reels)
    const mediaWithInsights: InstagramMedia[] = await Promise.all(
      mediaData.data.map(async (media: RawInstagramMedia) => {
        let insights = undefined;
        
        // Apenas buscar insights para vídeos, reels e carousels
        if (['VIDEO', 'REELS', 'CAROUSEL_ALBUM'].includes(media.media_type)) {
          try {
            console.log(`📊 [Media API] Buscando insights para mídia ${media.id} (${media.media_type})`);
            
            let insightsFields = '';
            if (media.media_type === 'VIDEO') {
              insightsFields = 'video_views,impressions,reach,engagement';
            } else if (media.media_type === 'REELS') {
              insightsFields = 'plays,reach,impressions,total_interactions,likes,comments,shares,saves';
            } else if (media.media_type === 'CAROUSEL_ALBUM') {
              insightsFields = 'impressions,reach,engagement';
            }

            const insightsURL = `https://graph.instagram.com/${media.id}/insights?metric=${insightsFields}&access_token=${accessToken}`;
            const insightsResponse = await axios.get(insightsURL);
            
            if (insightsResponse.status === 200) {
              insights = insightsResponse.data;
              console.log(`✅ [Media API] Insights obtidos para ${media.id}:`, insights.data?.length || 0, 'métricas');
            }
          } catch (insightsError) {
            console.warn(`⚠️ [Media API] Erro ao buscar insights para ${media.id}:`, insightsError);
            // Continuar sem insights se houver erro
          }
        }

        return {
          ...media,
          insights
        };
      })
    );

    console.log('✅ [Media API] Processamento concluído:', {
      totalMedia: mediaWithInsights.length,
      withInsights: mediaWithInsights.filter(m => m.insights).length
    });

    return NextResponse.json({
      success: true,
      data: mediaWithInsights,
      paging: mediaData.paging
    });

  } catch (error: unknown) {
    console.error('💥 [Media API] Erro ao buscar mídia do Instagram:', error);

    // Verificar se é erro de autenticação/token inválido
    if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 400)) {
      return NextResponse.json(
        { 
          error: 'Token de acesso inválido ou expirado',
          message: 'Faça login novamente no Instagram'
        },
        { status: 401 }
      );
    }

    // Erro genérico
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: 'Falha ao processar requisição de mídia Instagram'
      },
      { status: 500 }
    );
  }
}