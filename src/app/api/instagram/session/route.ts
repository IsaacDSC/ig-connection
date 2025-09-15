import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    console.log('🔍 API Session - Iniciando GET request...')
    
    const cookieStore = await cookies()
    console.log('🍪 Cookie store obtido')
    
    const accessToken = cookieStore.get('instagram_access_token')?.value
    const userId = cookieStore.get('instagram_user_id')?.value
    
    console.log('🍪 Cookies encontrados:', {
      hasAccessToken: !!accessToken,
      hasUserId: !!userId,
      accessTokenPreview: accessToken ? accessToken.substring(0, 10) + '...' : 'não encontrado',
      userId: userId || 'não encontrado'
    })
    
    if (!accessToken || !userId) {
      console.log('❌ Cookies não encontrados - retornando 401')
      return NextResponse.json(
        { 
          status: "error",
          message: "Instagram session not found",
          authenticated: false
        },
        { status: 401 }
      )
    }
    
    console.log('✅ Sessão válida encontrada - retornando dados')
    return NextResponse.json(
      { 
        status: "success",
        message: "Instagram session found",
        authenticated: true,
        data: {
          user_id: userId,
          access_token: accessToken
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('💥 Error retrieving Instagram session:', error)
    
    return NextResponse.json(
      { 
        status: "error",
        message: "Internal server error",
        authenticated: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// Rota para limpar a sessão (logout)
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    
    // Remove os cookies
    cookieStore.delete('instagram_access_token')
    cookieStore.delete('instagram_user_id')
    
    return NextResponse.json(
      { 
        status: "success",
        message: "Instagram session cleared",
        authenticated: false
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error clearing Instagram session:', error)
    
    return NextResponse.json(
      { 
        status: "error",
        message: "Error clearing session",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}