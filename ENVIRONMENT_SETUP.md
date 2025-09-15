# 🔧 Configuração de Ambiente

## 📋 Variáveis de Ambiente Necessárias

### 🏠 Desenvolvimento Local

1. **Copie o arquivo de exemplo:**
   ```bash
   cp env.example .env.local
   ```

2. **Preencha as variáveis no `.env.local`:**

```env
# URL base da aplicação
NEXT_PUBLIC_AUTH_URL=http://localhost:3000

# Chave secreta para NextAuth
NEXTAUTH_SECRET=sua-chave-secreta-aqui

# Instagram Business API
NEXT_PUBLIC_INSTAGRAM_CLIENT_ID=742086725267609
NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET=seu-client-secret-do-instagram

# URLs de callback
REDIRECT_URI=http://localhost:3000/api/auth/callback/instagram
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/api/auth/callback/instagram
```

### 🚀 Produção (Vercel)

Configure as seguintes variáveis no **Vercel Dashboard** → **Settings** → **Environment Variables**:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `NEXT_PUBLIC_AUTH_URL` | `https://seu-dominio.vercel.app` | URL da sua aplicação |
| `NEXTAUTH_SECRET` | `[chave-gerada]` | Chave secreta gerada |
| `NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET` | `[seu-secret]` | Client Secret do Instagram |
| `REDIRECT_URI` | `https://seu-dominio.vercel.app/api/auth/callback/instagram` | URL de callback |
| `NEXT_PUBLIC_INSTAGRAM_CLIENT_ID` | `742086725267609` | Client ID público |
| `NEXT_PUBLIC_REDIRECT_URI` | `https://seu-dominio.vercel.app/api/auth/callback/instagram` | URL de callback público |

## 🔐 Como Obter as Credenciais do Instagram

1. **Acesse o [Facebook Developers](https://developers.facebook.com/)**
2. **Crie uma nova aplicação**
3. **Adicione o produto "Instagram Basic Display" ou "Instagram Business"**
4. **Configure as URLs de callback:**
   - Desenvolvimento: `http://localhost:3000/api/auth/callback/instagram`
   - Produção: `https://seu-dominio.vercel.app/api/auth/callback/instagram`
5. **Copie o Client ID e Client Secret**

## 🔑 Gerar NEXTAUTH_SECRET

```bash
# Opção 1: OpenSSL
openssl rand -base64 32

# Opção 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opção 3: Online
# Visite: https://generate-secret.vercel.app/32
```

## ✅ Verificação da Configuração

1. **Execute o projeto localmente:**
   ```bash
   npm run dev
   ```

2. **Teste a autenticação:**
   - Acesse `http://localhost:3000`
   - Clique em "Conectar com Instagram"
   - Verifique se o redirecionamento funciona

3. **Verifique os logs:**
   - Abra o console do navegador (F12)
   - Verifique se não há erros de configuração

## 🚨 Segurança

- ✅ **Nunca commite** o arquivo `.env.local`
- ✅ **Use valores diferentes** para desenvolvimento e produção
- ✅ **Mantenha o Client Secret seguro** (nunca exponha no frontend)
- ✅ **Regenere as chaves** periodicamente
- ✅ **Use HTTPS** em produção

## 🔄 Atualização das Configurações

Após alterar as variáveis de ambiente:

1. **Desenvolvimento:** Reinicie o servidor (`npm run dev`)
2. **Produção:** Faça um novo deploy no Vercel

## 📞 Suporte

Se encontrar problemas:

1. Verifique se todas as variáveis estão definidas
2. Confirme se as URLs de callback estão corretas no Facebook Developers
3. Verifique os logs do console e do servidor
4. Teste com dados mock usando `/test-insights`
