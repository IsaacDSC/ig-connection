import { useState, useEffect } from 'react';
import axios from 'axios';
import { InstagramProfile } from '@/types/instagram';

export type { InstagramProfile };

interface UseInstagramProfileReturn {
  profile: InstagramProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  authenticated: boolean;
}

export function useInstagramProfile(): UseInstagramProfileReturn {
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const fetchProfile = () => {
    setLoading(true);
    setError(null);
    
    
    // Tentar buscar o perfil diretamente - se não houver sessão, receberemos 401
    axios.get('/api/instagram/profile')
      .then((response) => {
        
        // Se recebemos 401, significa que não há autenticação
        if (response.status === 401) {
          setAuthenticated(false);
          setProfile(null);
          setError(null);
          return;
        }
        
        if (response.data.success && response.data.data) {
          setProfile(response.data.data);
          setAuthenticated(true);
          setError(null);
        } else {
          setError(response.data.message || 'Erro ao carregar perfil');
          setAuthenticated(false);
        }
      })
      .catch((err) => {
        
        if (axios.isAxiosError(err)) {
          
          // Se for erro 401, tratar como não autenticado
          if (err.response?.status === 401) {
            setAuthenticated(false);
            setProfile(null);
            setError(null);
          } else {
            // Outros erros (500, network, etc.)
            const errorMessage = err.response?.data?.message || 'Erro ao conectar com a API';
            setError(errorMessage);
            setAuthenticated(false);
          }
        } else {
          setError('Erro inesperado ao carregar perfil');
          setAuthenticated(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const refetch = () => {
    fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refetch,
    authenticated
  };
}