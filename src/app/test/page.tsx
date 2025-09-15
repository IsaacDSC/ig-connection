"use client"

import { useState } from 'react'

export default function TestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testSession = async () => {
    setLoading(true)
    try {
      console.log('🧪 Testando API de sessão...')
      
      const response = await fetch('/api/instagram/session')
      const data = await response.json()
      
      console.log('🧪 Resposta da API:', data)
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('🧪 Erro no teste:', error)
      setResult(`Erro: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const simulateCallback = async () => {
    setLoading(true)
    try {
      console.log('🧪 Simulando callback com dados fake...')
      
      // Simular um redirect direto para testar os cookies
      window.location.href = '/api/auth/callback/instagram?code=fake_code_for_testing&state=test_state'
    } catch (error) {
      console.error('🧪 Erro na simulação:', error)
      setResult(`Erro: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Página de Teste - Instagram</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Testar API de Sessão</h2>
          <button
            onClick={testSession}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4"
          >
            {loading ? 'Testando...' : 'Testar /api/instagram/session'}
          </button>
          
          <button
            onClick={simulateCallback}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Simular Callback
          </button>
        </div>

        {result && (
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
            <h3 className="text-lg font-semibold mb-2">Resultado:</h3>
            <pre className="text-sm">{result}</pre>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">📋 Instruções:</h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>Primeiro, clique em &quot;Testar /api/instagram/session&quot; para ver se a API funciona</li>
            <li>Veja os logs no console do navegador (F12)</li>
            <li>Se necessário, clique em &quot;Simular Callback&quot; para testar o fluxo</li>
            <li>Verifique os logs tanto no browser quanto no terminal do servidor</li>
          </ol>
        </div>
      </div>
    </div>
  )
}