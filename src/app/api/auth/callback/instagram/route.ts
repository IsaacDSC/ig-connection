import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import axios from 'axios'
import { INSTAGRAM_CONFIG, getRedirectUri, getDashboardUrl } from '@/lib/config'

interface TokenResponse {
  access_token: string
  user_id: number
}

interface ErrorResponse {
  error: string
  error_description: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    console.log('Instagram callback received:', { code, state })

    // Validação básica do state (UUID format)
    if (state) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (uuidRegex.test(state)) {
        console.log('✅ State parameter is a valid UUID:', state)
      } else {
        console.log('⚠️ State parameter is not a UUID format:', state)
      }
    } else {
      console.log('⚠️ No state parameter received in callback')
    }

    if (!code) {
      console.error('No code received in callback')
      return NextResponse.json(
        {
          status: "error",
          message: "Authorization code not received"
        },
        { status: 400 }
      )
    }

    // Configurações do Instagram
    const clientId = INSTAGRAM_CONFIG.CLIENT_ID
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET
    const redirectUri = getRedirectUri()

    if (!redirectUri) {
      throw new Error('REDIRECT_URI not configured')
    }

    if (!clientSecret) {
      console.error('Instagram client secret not configured')
      return NextResponse.json(
        {
          status: "error",
          message: "Instagram client secret not configured"
        },
        { status: 500 }
      )
    }

    // URL para trocar código por token
    const tokenURL = INSTAGRAM_CONFIG.TOKEN_URL

    // Preparar dados para a requisição
    const formData = new URLSearchParams()
    formData.append('client_id', clientId || '')
    formData.append('client_secret', clientSecret)
    formData.append('grant_type', 'authorization_code')
    formData.append('redirect_uri', redirectUri)
    formData.append('code', code)

    console.log('Exchanging code for token...')
    console.log('Token URL:', tokenURL)
    console.log('Request data:', {
      client_id: clientId,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code: code.substring(0, 10) + '...' // Log apenas os primeiros 10 caracteres do código por segurança
    })

    // Fazer a requisição para trocar código por token
    const response = await axios.post<TokenResponse>(tokenURL, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('✅ Token exchange successful!')
    console.log('Response status:', response.status)
    console.log('Access token received:', response.data.access_token.substring(0, 20) + '...')
    console.log('User ID:', response.data.user_id)
    console.log('Full token response:', {
      access_token: response.data.access_token,
      user_id: response.data.user_id
    })

    // Salvar dados nos cookies de forma segura
    console.log('🍪 Iniciando salvamento dos cookies...')
    const cookieStore = await cookies()

    // Configurar cookies com dados do Instagram
    console.log('🍪 Salvando instagram_access_token...')
    cookieStore.set('instagram_access_token', response.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 60, // 60 dias
      path: '/'
    })

    console.log('🍪 Salvando instagram_user_id...')
    cookieStore.set('instagram_user_id', response.data.user_id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 60, // 60 dias
      path: '/'
    })

    console.log('✅ Cookies salvos com sucesso!')

    const dashboardUrl = getDashboardUrl(new URL(request.url).origin)

    console.log('🔄 Redirecting to dashboard:', dashboardUrl)

    return NextResponse.redirect(dashboardUrl)
  } catch (error) {
    console.error('❌ Error in Instagram callback:', error)

    if (axios.isAxiosError(error)) {
      console.error('Axios error details:')
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)

      if (error.response?.data) {
        const errorData = error.response.data as ErrorResponse
        console.error('Instagram API Error:', { errorData })

        return NextResponse.json(
          {
            status: "error",
            message: { errorData }
          },
          { status: error.response.status }
        )
      }
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Caso precise suportar POST também
  return GET(request)
}