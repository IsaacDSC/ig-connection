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
  insightsError?: {
    reason: string;
    message: string;
    details?: string;
  };
}

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
    
    console.log('🧪 [Test Media Hook] Buscando dados de teste...');
    
    axios.get('/api/instagram/media-test')
      .then((response: { status: number; data: InstagramMediaResponse }) => {
        console.log('📡 [Test Media Hook] Resposta recebida:', {
          status: response.status,
          hasData: !!response.data,
          success: response.data?.success,
          mediaCount: response.data?.data?.length || 0,
          testMode: response.data?.testMode
        });
        
        if (response.data.success && response.data.data) {
          console.log('✅ [Test Media Hook] Dados de teste obtidos com sucesso:', {
            count: response.data.data.length,
            sampleInsights: response.data.data[0]?.insights?.data?.length || 0
          });
          
          setMedia(response.data.data);
          setError(null);
        } else {
          console.log('❌ [Test Media Hook] Resposta inválida da API de teste:', response.data);
          setError('Erro ao carregar dados de teste');
        }
      })
      .catch((err) => {
        console.error('💥 [Test Media Hook] Erro durante o processo de busca dos dados de teste:', err);
        setError('Erro inesperado ao carregar dados de teste');
      })
      .finally(() => {
        console.log('🏁 [Test Media Hook] Finalizando busca dos dados de teste');
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