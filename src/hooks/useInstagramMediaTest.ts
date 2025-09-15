import { useState, useEffect } from 'react';
import axios from 'axios';
import { InstagramMedia } from '@/types/instagram';

interface InstagramMediaResponse {
  success: boolean;
  data: InstagramMedia[];
  paging?: {
    next?: string;
    previous?: string;
  };
  testMode?: boolean;
}

interface UseInstagramMediaTestReturn {
  media: InstagramMedia[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  authenticated: boolean;
}

export function useInstagramMediaTest(): UseInstagramMediaTestReturn {
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = () => {
    setLoading(true);
    setError(null);
    
    
    axios.get('/api/instagram/media-test')
      .then((response: { status: number; data: InstagramMediaResponse }) => {
        
        if (response.data.success && response.data.data) {
          
          setMedia(response.data.data);
          setError(null);
        } else {
          setError('Erro ao carregar dados de teste');
        }
      })
      .catch(() => {
        setError('Erro inesperado ao carregar dados de teste');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const refetch = () => {
    fetchMedia();
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  return {
    media,
    loading,
    error,
    refetch,
    authenticated: true // Sempre true para teste
  };
}