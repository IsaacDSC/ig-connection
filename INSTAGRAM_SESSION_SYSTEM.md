# Sistema de Autenticação Instagram

## Como Funciona

Este sistema implementa o fluxo OAuth do Instagram para salvar o `userId` e `access_token` em cookies seguros e redirecionar para o dashboard.

## Fluxo Implementado

### 1. Callback do Instagram (`/api/auth/callback/instagram/route.ts`)
- Recebe o código de autorização do Instagram
- Troca o código por um access token
- **Salva os dados nos cookies HTTP-only:**
  - `instagram_access_token`: Token de acesso
  - `instagram_user_id`: ID do usuário
- **Redireciona automaticamente para:** `NEXTAUTH_URL/dashboard` ou `/dashboard`

### 2. API de Sessão (`/api/instagram/session/route.ts`)
- **GET**: Recupera dados da sessão dos cookies
- **DELETE**: Remove os cookies da sessão (logout)

### 3. Dashboard (`/src/app/dashboard/page.tsx`)
- Verifica automaticamente se existe uma sessão ativa
- Exibe o status da conexão no header
- Mostra os dados da sessão (User ID e token mascarado)
- Permite desconectar da sessão

### 4. Utilitários (`/src/lib/instagram.ts`)
- `checkInstagramSession()`: Verifica sessão ativa
- `clearInstagramSession()`: Remove sessão
- `formatTokenForDisplay()`: Mascara token para exibição
- `buildInstagramAuthUrl()`: Constrói URL de autorização

## Segurança

### Cookies HTTP-Only
- Os tokens são salvos em cookies `httpOnly: true`
- Não acessíveis via JavaScript no client-side
- Proteção contra XSS
- Expiram em 60 dias
- Configuração `sameSite: 'lax'` para proteção CSRF

### Ambiente de Produção
- Cookies marcados como `secure: true` em produção
- Exigem HTTPS

## Variáveis de Ambiente

```env
NEXTAUTH_URL=https://seu-dominio.com
NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET=seu_client_secret
```

## Como Testar

1. **Acessar a URL de autorização do Instagram**
2. **Autorizar a aplicação**
3. **Ser redirecionado para:** `/api/auth/callback/instagram`
4. **Sistema automaticamente:**
   - Salva os dados nos cookies
   - Redireciona para `/dashboard`
5. **No dashboard:**
   - Ver status "✓ Conectado ao Instagram"
   - Ver User ID
   - Ver token mascarado
   - Poder desconectar

## Exemplo de Resposta da Sessão

```json
{
  "status": "success",
  "message": "Instagram session found",
  "authenticated": true,
  "data": {
    "user_id": "123456789",
    "access_token": "IGQVJ..."
  }
}
```

## Estados Possíveis

### ✅ Conectado
- Cookies válidos encontrados
- Exibe dados da sessão
- Status verde no dashboard

### ❌ Não Conectado
- Nenhum cookie encontrado
- Status vermelho no dashboard
- Opção para nova autenticação

### 🔄 Verificando
- Estado de loading inicial
- Checando cookies de sessão

## Limpeza de Sessão

```typescript
// Limpar sessão programaticamente
const result = await clearInstagramSession()
if (result.status === 'success') {
  // Sessão removida com sucesso
}
```

## Próximos Passos Possíveis

1. **Refresh Token**: Implementar renovação automática
2. **API Calls**: Usar o token para chamadas à API do Instagram
3. **Middleware**: Proteção de rotas que requerem autenticação
4. **Database**: Persistir tokens em banco de dados
5. **Multiple Users**: Suporte a múltiplos usuários

---

**✨ Implementação Concluída com Sucesso!**