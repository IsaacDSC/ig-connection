import { useState, useEffect } from 'react';
import axios from 'axios';
import { InstagramMedia } from '@/types/instagram';

export type { InstagramMedia };

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
    
    
    const requestUrl = url || `/api/instagram/media?limit=${limit}`;
    
    axios.get(requestUrl)
      .then((response: { status: number; data: InstagramMediaResponse }) => {
        
        if (response.status === 401) {
          setAuthenticated(false);
          setMedia([]);
          setError(null);
          return;
        }
        
        if (response.data.success && response.data.data) {
          
          if (isLoadMore) {
            setMedia(prev => [...prev, ...response.data.data]);
          } else {
            setMedia(response.data.data);
          }
          
          setNextPageUrl(response.data.paging?.next || null);
          setAuthenticated(true);
          setError(null);
        } else {
          setError('Erro ao carregar mídia');
          setAuthenticated(false);
        }
      })
      .catch((err) => {
        
        if (axios.isAxiosError(err)) {
          
          if (err.response?.status === 401) {
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