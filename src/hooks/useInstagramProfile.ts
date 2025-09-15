import { useState, useEffect } from 'react';
import axios from 'axios';

export interface InstagramProfile {
  id: string;
  user_id: string;
  name: string;
  username: string;
  biography?: string;
  website?: string;
  account_type: string;
  profile_picture_url: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
}

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
    
    console.log('🔍 [Hook] Tentando buscar perfil do Instagram...');
    
    // Tentar buscar o perfil diretamente - se não houver sessão, receberemos 401
    axios.get('/api/instagram/profile')
      .then((response) => {
        console.log('📡 [Hook] Resposta recebida:', {
          status: response.status,
          hasData: !!response.data,
          success: response.data?.success
        });
        
        // Se recebemos 401, significa que não há autenticação
        if (response.status === 401) {
          console.log('🔓 [Hook] Usuário não autenticado (401) - mostrando tela de login');
          setAuthenticated(false);
          setProfile(null);
          setError(null);
          return;
        }
        
        if (response.data.success && response.data.data) {
          console.log('✅ [Hook] Perfil obtido com sucesso:', {
            username: response.data.data.username,
            name: response.data.data.name,
            followers: response.data.data.followers_count
          });
          setProfile(response.data.data);
          setAuthenticated(true);
          setError(null);
        } else {
          console.log('❌ [Hook] Resposta inválida da API de perfil:', response.data);
          setError(response.data.message || 'Erro ao carregar perfil');
          setAuthenticated(false);
        }
      })
      .catch((err) => {
        console.error('💥 [Hook] Erro durante o processo de busca do perfil:', err);
        
        if (axios.isAxiosError(err)) {
          console.log('🔍 [Hook] Detalhes do erro:', {
            status: err.response?.status,
            message: err.response?.data?.message,
            url: err.config?.url
          });
          
          // Se for erro 401, tratar como não autenticado
          if (err.response?.status === 401) {
            console.log('🔓 [Hook] Erro 401 - usuário não autenticado');
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
        console.log('🏁 [Hook] Finalizando busca do perfil');
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