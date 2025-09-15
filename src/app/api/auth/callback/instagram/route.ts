import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

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
    const clientId = process.env.INSTAGRAM_CLIENT_ID || process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || "742086725267609"
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || "https://0190ec42c1ca.ngrok-free.app/api/auth/callback/instagram"
    
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
    const tokenURL = "https://api.instagram.com/oauth/access_token"
    
    // Preparar dados para a requisição
    const formData = new URLSearchParams()
    formData.append('client_id', clientId)
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
    
    return NextResponse.json(
      { 
        status: "success",
        message: "Instagram authorization successful",
        data: {
          access_token: response.data.access_token,
          user_id: response.data.user_id
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error in Instagram callback:', error)
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:')
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)
      
      if (error.response?.data) {
        const errorData = error.response.data as ErrorResponse
        console.error('Instagram API Error:', errorData.error, '-', errorData.error_description)
        
        return NextResponse.json(
          { 
            status: "error",
            message: `Instagram API error: ${errorData.error} - ${errorData.error_description}`
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