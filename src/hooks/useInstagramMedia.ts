import { useState, useEffect } from 'react';
import axios from 'axios';

export interface InstagramMedia {
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

interface InstagramMediaResponse {
  success: boolean;
  data: InstagramMedia[];
  paging?: {
    next?: string;
    previous?: string;
  };
}

interface UseInstagramMediaReturn {
  media: InstagramMedia[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  authenticated: boolean;
  hasNextPage: boolean;
  loadMore: () => void;
  loadingMore: boolean;
}

export function useInstagramMedia(limit: number = 25): UseInstagramMediaReturn {
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);

  const fetchMedia = (isLoadMore = false, url?: string) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }
    
    console.log('🔍 [Media Hook] Tentando buscar mídia do Instagram...');
    
    const requestUrl = url || `/api/instagram/media?limit=${limit}`;
    
    axios.get(requestUrl)
      .then((response: { status: number; data: InstagramMediaResponse }) => {
        console.log('📡 [Media Hook] Resposta recebida:', {
          status: response.status,
          hasData: !!response.data,
          success: response.data?.success,
          mediaCount: response.data?.data?.length || 0
        });
        
        if (response.status === 401) {
          console.log('🔓 [Media Hook] Usuário não autenticado (401)');
          setAuthenticated(false);
          setMedia([]);
          setError(null);
          return;
        }
        
        if (response.data.success && response.data.data) {
          console.log('✅ [Media Hook] Mídia obtida com sucesso:', {
            count: response.data.data.length,
            hasNext: !!response.data.paging?.next
          });
          
          if (isLoadMore) {
            setMedia(prev => [...prev, ...response.data.data]);
          } else {
            setMedia(response.data.data);
          }
          
          setNextPageUrl(response.data.paging?.next || null);
          setAuthenticated(true);
          setError(null);
        } else {
          console.log('❌ [Media Hook] Resposta inválida da API de mídia:', response.data);
          setError('Erro ao carregar mídia');
          setAuthenticated(false);
        }
      })
      .catch((err) => {
        console.error('💥 [Media Hook] Erro durante o processo de busca da mídia:', err);
        
        if (axios.isAxiosError(err)) {
          console.log('🔍 [Media Hook] Detalhes do erro:', {
            status: err.response?.status,
            message: err.response?.data?.message,
            url: err.config?.url
          });
          
          if (err.response?.status === 401) {
            console.log('🔓 [Media Hook] Erro 401 - usuário não autenticado');
            setAuthenticated(false);
            setMedia([]);
            setError(null);
          } else {
            const errorMessage = err.response?.data?.message || 'Erro ao conectar com a API';
            setError(errorMessage);
            setAuthenticated(false);
          }
        } else {
          setError('Erro inesperado ao carregar mídia');
          setAuthenticated(false);
        }
      })
      .finally(() => {
        console.log('🏁 [Media Hook] Finalizando busca da mídia');
        if (isLoadMore) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      });
  };

  const refetch = () => {
    setMedia([]);
    setNextPageUrl(null);
    fetchMedia(false);
  };

  const loadMore = () => {
    if (nextPageUrl && !loadingMore) {
      fetchMedia(true, nextPageUrl);
    }
  };

  useEffect(() => {
    fetchMedia(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  return {
    media,
    loading,
    error,
    refetch,
    authenticated,
    hasNextPage: !!nextPageUrl,
    loadMore,
    loadingMore
  };
}