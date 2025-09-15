export interface InstagramSession {
  user_id: string
  access_token: string
}

export interface InstagramSessionResponse {
  status: 'success' | 'error'
  message: string
  authenticated: boolean
  data?: InstagramSession
  error?: string
}

/**
 * Verifica se existe uma sessão ativa do Instagram
 */
export async function checkInstagramSession(): Promise<InstagramSessionResponse> {
  try {
    console.log('🔗 Fazendo fetch para /api/instagram/session...')
    const response = await fetch('/api/instagram/session')
    
    console.log('📊 Response status:', response.status)
    console.log('📊 Response ok:', response.ok)
    
    const data = await response.json()
    console.log('📊 Response data:', data)
    
    return data
  } catch (error) {
    console.error('💥 Erro na função checkInstagramSession:', error)
    return {
      status: 'error',
      message: 'Erro ao verificar sessão',
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Remove a sessão ativa do Instagram
 */
export async function clearInstagramSession(): Promise<InstagramSessionResponse> {
  try {
    const response = await fetch('/api/instagram/session', {
      method: 'DELETE'
    })
    return await response.json()
  } catch (error) {
    return {
      status: 'error',
      message: 'Erro ao limpar sessão',
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Constrói a URL de autorização do Instagram
 */
export function buildInstagramAuthUrl(
  clientId: string,
  redirectUri: string,
  state?: string
): string {
  const baseUrl = 'https://api.instagram.com/oauth/authorize'
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'user_profile,user_media',
    response_type: 'code'
  })

  if (state) {
    params.append('state', state)
  }

  return `${baseUrl}?${params.toString()}`
}

/**
 * Formata token para exibição (mantém apenas os primeiros caracteres)
 */
export function formatTokenForDisplay(token: string, visibleChars: number = 20): string {
  if (!token) return ''
  return token.length > visibleChars 
    ? `${token.substring(0, visibleChars)}...`
    : token
}