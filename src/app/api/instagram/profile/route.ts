import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    // Verificar se há cookies de sessão do Instagram
    const cookies = request.cookies;
    const userIdCookie = cookies.get('instagram_user_id');
    const accessTokenCookie = cookies.get('instagram_access_token');

    console.log('🍪 Verificando cookies:', {
      hasUserIdCookie: !!userIdCookie,
      hasAccessTokenCookie: !!accessTokenCookie,
      userIdValue: userIdCookie?.value,
      accessTokenPreview: accessTokenCookie?.value ? 
        `${accessTokenCookie.value.substring(0, 20)}...` : 'N/A'
    });

    if (!userIdCookie || !accessTokenCookie) {
      console.log('❌ Cookies de sessão Instagram não encontrados');
      return NextResponse.json(
        { 
          error: 'Sessão Instagram não encontrada',
          message: 'Você precisa estar logado no Instagram para acessar este recurso'
        },
        { status: 401 }
      );
    }

    const accessToken = accessTokenCookie.value;

    // URL da API do Instagram Graph com os campos desejados
    const profileURL = `https://graph.instagram.com/me?fields=id,user_id,name,username,biography,website,account_type,profile_picture_url,followers_count,follows_count,media_count&access_token=${accessToken}`;

    console.log('🔍 Buscando perfil do Instagram para user:', userIdCookie.value);

    // Fazer requisição para a API do Instagram
    const response = await axios.get(profileURL);

    if (response.status !== 200) {
      console.error('❌ Erro na API do Instagram:', response.status, response.data);
      return NextResponse.json(
        { 
          error: 'Erro da API do Instagram',
          message: 'Falha ao buscar dados do perfil'
        },
        { status: response.status }
      );
    }

    const profileData = response.data;

    console.log('✅ Perfil Instagram obtido com sucesso:', {
      id: profileData.id,
      username: profileData.username,
      name: profileData.name,
      followers_count: profileData.followers_count
    });

    return NextResponse.json({
      success: true,
      data: profileData
    });

  } catch (error: unknown) {
    console.error('💥 Erro ao buscar perfil do Instagram:', error);

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
        message: 'Falha ao processar requisição do perfil Instagram'
      },
      { status: 500 }
    );
  }
}