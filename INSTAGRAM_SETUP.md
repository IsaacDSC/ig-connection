# Configuração do Instagram Business API

Este guia detalha como configurar a integração com a Instagram Business API.

## 📝 Pré-requisitos

- Conta no Facebook (necessária para acessar o Facebook Developers)
- Conta Business no Instagram (obrigatória para Instagram Business API)
- Aplicação deve estar em modo de desenvolvimento

## 🔧 Passo a Passo

### 1. Acesse o Facebook Developers Console

1. Vá para [https://developers.facebook.com/](https://developers.facebook.com/)
2. Faça login com sua conta do Facebook
3. Clique em "Meus Apps" no menu superior

### 2. Crie um Novo App

1. Clique em "Criar App"
2. Selecione "Outro" como tipo de app
3. Clique em "Avançar"
4. Preencha as informações:
   - **Nome do App**: `Instagram Business Connection Demo`
   - **E-mail de contato**: seu e-mail
   - **Finalidade do App**: Selecione uma opção apropriada
5. Clique em "Criar App"

### 3. Adicione o Instagram Business API

1. No painel do app, na seção "Produtos", encontre "Instagram API"
2. Clique em "Configurar"
3. Aceite os termos de uso

### 4. Configure o Instagram Business API

1. Vá para "Instagram API" > "Configurações básicas"
2. Anote os seguintes valores:
   - **ID do App**: Este será seu `INSTAGRAM_CLIENT_ID`
   - **Chave secreta do app**: Este será seu `NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET`

### 5. Configure as URLs de Redirecionamento

1. Na seção "Valid OAuth Redirect URIs", adicione:
   - Para desenvolvimento: `http://localhost:3000/api/auth/callback/instagram`
   - Para produção: `https://seu-dominio.vercel.app/api/auth/callback/instagram`
2. Clique em "Salvar alterações"

### 6. Configure conta Business do Instagram

⚠️ **IMPORTANTE**: A Instagram Business API requer uma conta Business do Instagram

1. Conecte sua conta Business do Instagram ao app do Facebook
2. Vá para "Instagram API" > "Configurações"
3. Adicione sua conta Business do Instagram
4. Configure as permissões necessárias:
   - `instagram_business_basic`: Acesso básico ao perfil
   - `instagram_business_manage_messages`: Gerenciar mensagens
   - `instagram_business_manage_comments`: Gerenciar comentários  
   - `instagram_business_content_publish`: Publicar conteúdo
   - `instagram_business_manage_insights`: Acessar insights

### 7. Configure as Variáveis de Ambiente

Crie ou atualize o arquivo `.env.local`:

```env
NEXT_PUBLIC_AUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-super-segura-aqui
INSTAGRAM_CLIENT_ID=seu-id-do-app-instagram-business
NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET=sua-chave-secreta-do-app-instagram-business
INSTAGRAM_API_BASE_URL=https://graph.instagram.com
```

## 🚨 Problemas Comuns

### Erro: "Invalid OAuth access token"
- Verifique se as credenciais estão corretas
- Confirme se o usuário está adicionado como Instagram Tester

### Erro: "Invalid redirect URI"
- Verifique se a URL de callback está correta no painel do Facebook
- Confirme se a `NEXT_PUBLIC_AUTH_URL` está configurada corretamente

### Erro: "App not approved for login"
- O app está em modo de desenvolvimento
- Apenas usuários adicionados como "Instagram Testers" podem fazer login

### Insights não aparecem
- Verifique se a conta do Instagram é Business ou Creator
- Contas pessoais têm acesso limitado a insights

## 📊 Tipos de Conta

### Conta Pessoal
- Acesso a mídia básica (fotos e vídeos)
- Sem acesso a insights detalhados

### Conta Business/Creator
- Acesso completo a insights
- Métricas detalhadas de engagement
- Informações de alcance e impressões

## 🔒 Segurança

### Para Produção

1. **Mude para modo de produção** no Facebook Developers
2. **Use HTTPS** obrigatoriamente
3. **Configure domínios permitidos** nas configurações do app
4. **Use chaves secretas seguras** (pelo menos 32 caracteres)

### Exemplo de NEXTAUTH_SECRET seguro:
```bash
# Gere uma chave segura
openssl rand -base64 32
```

## 🚀 Deploy

### Vercel

1. Configure as variáveis de ambiente na Vercel:
   ```
   NEXT_PUBLIC_AUTH_URL=https://seu-projeto.vercel.app
   NEXTAUTH_SECRET=sua-chave-secreta-production
   INSTAGRAM_CLIENT_ID=seu-instagram-client-id
   NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET=seu-instagram-client-secret
   INSTAGRAM_API_BASE_URL=https://graph.instagram.com
   ```

2. Adicione a URL de produção no Facebook Developers:
   ```
   https://seu-projeto.vercel.app/api/auth/callback/instagram
   ```

## 📖 Recursos Úteis

- [Instagram Basic Display API Docs](https://developers.facebook.com/docs/instagram-basic-display-api)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Facebook App Review Process](https://developers.facebook.com/docs/app-review)