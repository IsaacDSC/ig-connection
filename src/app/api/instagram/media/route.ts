import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { InstagramMedia, RawInstagramMedia } from '@/types/instagram';
import { INSTAGRAM_CONFIG } from '@/lib/config';

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

    // Primeiro, verificar o tipo de conta para diagnosticar problemas com insights
    try {
      const accountInfoURL = `${INSTAGRAM_CONFIG.GRAPH_API_URL}/me?fields=account_type&access_token=${accessToken}`;
      const accountResponse = await axios.get(accountInfoURL);
      
      if (accountResponse.status === 200) {
        const accountType = accountResponse.data.account_type;
        console.log(`🏢 [Media API] Tipo de conta detectado: ${accountType}`);
        
        if (accountType === 'PERSONAL') {
          console.warn(`⚠️ [Media API] Conta PESSOAL detectada - insights podem ter limitações`);
        }
      }
    } catch (accountError) {
      console.warn('⚠️ [Media API] Não foi possível verificar tipo de conta:', accountError);
    }

    // URL da API do Instagram Graph para buscar mídia do usuário
    const mediaURL = `${INSTAGRAM_CONFIG.GRAPH_API_URL}/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&limit=${limit}&access_token=${accessToken}`;

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
        let insightsError = undefined;
        
        // Apenas buscar insights para vídeos, reels e carousels
        if (['VIDEO', 'REELS', 'CAROUSEL_ALBUM', 'IMAGE'].includes(media.media_type)) {
          try {
            console.log(`📊 [Media API] Buscando insights para mídia ${media.id} (${media.media_type})`);
            
            // Verificar se é um post muito recente (últimas 24h) - insights podem não estar disponíveis
            const mediaDate = new Date(media.timestamp);
            const now = new Date();
            const hoursDiff = (now.getTime() - mediaDate.getTime()) / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
              console.warn(`⏰ [Media API] Post ${media.id} é muito recente (${hoursDiff.toFixed(1)}h) - insights podem não estar disponíveis`);
              insightsError = {
                reason: 'RECENT_POST',
                message: 'Post muito recente',
                details: `Publicado há ${hoursDiff.toFixed(1)} horas. Insights ficam disponíveis após 24h.`
              };
            }
            
            // Campos de insights específicos baseados no tipo de mídia
            let insightsFields: string[] = [];
            if (media.media_type === 'VIDEO') {
              // Para vídeos, começar apenas com a métrica mais básica
              insightsFields = ['video_views'];
            } else if (media.media_type === 'REELS') {
              insightsFields = ['plays'];
            } else if (media.media_type === 'CAROUSEL_ALBUM') {
              insightsFields = ['impressions'];
            } else if (media.media_type === 'IMAGE') {
              insightsFields = ['impressions'];
            }

            console.log(`🔍 [Media API] Tentando buscar métrica principal: ${insightsFields.join(', ')}`);

            // Tentar buscar insights primeiro com uma métrica básica
            const insightsURL = `${INSTAGRAM_CONFIG.GRAPH_API_URL}/${media.id}/insights?metric=${insightsFields.join(',')}&access_token=${accessToken}`;
            
            try {
              const insightsResponse = await axios.get(insightsURL);
              
              if (insightsResponse.status === 200) {
                insights = insightsResponse.data;
                insightsError = undefined; // Limpar erro se sucesso
                console.log(`✅ [Media API] Insights básicos obtidos para ${media.id}:`, {
                  total: insights.data?.length || 0,
                  metrics: insights.data?.map((i: { name: string }) => i.name) || []
                });

                // Agora tentar buscar métricas de engagement adicionais
                if (insights.data && insights.data.length > 0) {
                  try {
                    const engagementFields = ['likes', 'comments', 'shares', 'saved'];
                    const engagementURL = `${INSTAGRAM_CONFIG.GRAPH_API_URL}/${media.id}/insights?metric=${engagementFields.join(',')}&access_token=${accessToken}`;
                    const engagementResponse = await axios.get(engagementURL);
                    
                    if (engagementResponse.status === 200 && engagementResponse.data.data) {
                      // Combinar os insights
                      insights.data = [...insights.data, ...engagementResponse.data.data];
                      console.log(`🎯 [Media API] Métricas de engagement adicionadas para ${media.id}:`, {
                        totalFinal: insights.data.length,
                        allMetrics: insights.data.map((i: { name: string }) => i.name)
                      });
                    }
                  } catch (engagementError) {
                    console.warn(`⚠️ [Media API] Erro ao buscar métricas de engagement para ${media.id}:`, {
                      error: axios.isAxiosError(engagementError) ? {
                        status: engagementError.response?.status,
                        statusText: engagementError.response?.statusText,
                        data: engagementError.response?.data
                      } : engagementError
                    });
                  }
                }
              }
            } catch (basicInsightsError) {
              console.error(`❌ [Media API] Erro com métricas básicas para ${media.id}:`, {
                error: axios.isAxiosError(basicInsightsError) ? {
                  status: basicInsightsError.response?.status,
                  statusText: basicInsightsError.response?.statusText,
                  data: basicInsightsError.response?.data,
                  url: basicInsightsError.config?.url
                } : basicInsightsError
              });
              
              // Determinar a razão do erro
              if (axios.isAxiosError(basicInsightsError)) {
                const status = basicInsightsError.response?.status;
                const errorData = basicInsightsError.response?.data;
                
                if (status === 400) {
                  if (errorData?.error?.message?.includes('Unsupported get request')) {
                    insightsError = {
                      reason: 'UNSUPPORTED_METRIC',
                      message: 'Métricas não suportadas',
                      details: 'Este tipo de post não suporta as métricas solicitadas.'
                    };
                  } else if (errorData?.error?.message?.includes('permissions')) {
                    insightsError = {
                      reason: 'PERMISSIONS',
                      message: 'Permissões insuficientes',
                      details: 'Token não tem permissões para acessar insights desta mídia.'
                    };
                  } else {
                    insightsError = {
                      reason: 'PERSONAL_ACCOUNT',
                      message: 'Conta pessoal',
                      details: 'Insights completos só estão disponíveis para contas business.'
                    };
                  }
                } else if (status === 403) {
                  insightsError = {
                    reason: 'ACCESS_DENIED',
                    message: 'Acesso negado',
                    details: 'Não há permissão para acessar insights desta mídia.'
                  };
                } else {
                  insightsError = {
                    reason: 'API_ERROR',
                    message: 'Erro da API',
                    details: `Erro ${status}: ${errorData?.error?.message || 'Erro desconhecido'}`
                  };
                }
              } else {
                insightsError = {
                  reason: 'UNKNOWN_ERROR',
                  message: 'Erro desconhecido',
                  details: 'Erro inesperado ao buscar insights.'
                };
              }
              
              console.log(`ℹ️ [Media API] Insights não disponíveis para ${media.id}: ${insightsError.message}`);
            }
          } catch (generalError) {
            console.error(`❌ [Media API] Erro geral ao buscar insights para ${media.id}:`, generalError);
            insightsError = {
              reason: 'GENERAL_ERROR',
              message: 'Erro no processamento',
              details: 'Erro inesperado durante o processamento de insights.'
            };
          }
        } else {
          // Tipo de mídia não suportado para insights
          insightsError = {
            reason: 'UNSUPPORTED_MEDIA_TYPE',
            message: 'Tipo não suportado',
            details: `Insights não estão disponíveis para mídia do tipo ${media.media_type}.`
          };
        }

        return {
          ...media,
          insights,
          insightsError
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