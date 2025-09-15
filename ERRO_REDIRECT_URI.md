# 🚨 Resolução do Erro: Invalid redirect_uri

## ❌ Erro Atual
```
Invalid Request: Request parameters are invalid: Invalid redirect_uri
```

## ✅ Solução Implementada

### 1. Código Corrigido
Adicionei o parâmetro `redirect_uri` explicitamente na configuração OAuth.

### 2. Verificações Necessárias no Facebook Developers

#### 📋 Checklist de Configuração:

1. **Acesse seu App no Facebook Developers:**
   - Vá para [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/)
   - Selecione seu app com ID: `742086725267609`

2. **Verificar Instagram API Settings:**
   - No menu lateral, clique em "Instagram API"
   - Clique em "Configurações básicas"

3. **Configurar Valid OAuth Redirect URIs:**
   
   ⚠️ **IMPORTANTE**: Adicione EXATAMENTE estas URLs:
   ```
   http://localhost:3000/api/auth/callback/instagram
   ```
   
   Para produção (quando fizer deploy):
   ```
   https://seu-dominio.vercel.app/api/auth/callback/instagram
   ```

4. **Verificar se o tipo de App está correto:**
   - Deve ser configurado para "Instagram Business API"
   - NÃO deve ser "Instagram Basic Display"

5. **Verificar se a conta Instagram está conectada:**
   - Vá para "Instagram API" > "Configurações"
   - Sua conta Business do Instagram deve estar listada e conectada

### 3. URLs que devem estar configuradas

#### ✅ Para Desenvolvimento:
```
http://localhost:3000/api/auth/callback/instagram
```

#### ✅ Para Produção:
```
https://seu-dominio.vercel.app/api/auth/callback/instagram
```

### 4. Verificações Adicionais

#### 🔍 Confirme se:
- [ ] A URL não tem barra no final (`/`)
- [ ] A URL usa `http://` para localhost (não `https://`)
- [ ] O porto está correto (`:3000`)
- [ ] O caminho está correto (`/api/auth/callback/instagram`)

#### 🔍 Verifique se sua conta Instagram:
- [ ] É uma conta Business (não pessoal)
- [ ] Está conectada ao app do Facebook
- [ ] Tem as permissões necessárias

### 5. Teste da Configuração

Após fazer essas configurações:

1. **Salve as alterações** no Facebook Developers
2. **Aguarde alguns minutos** (as vezes demora para propagar)
3. **Teste novamente** o login na aplicação

### 6. Se o erro persistir

#### Opção A: Verificar logs detalhados
Adicione debug no console:
```bash
NEXTAUTH_DEBUG=true npm run dev
```

#### Opção B: Verificar se a URL está sendo construída corretamente
1. Inspecione a rede no navegador
2. Veja qual URL está sendo chamada quando clica em "Entrar com Instagram"
3. Compare com a URL configurada no Facebook

### 7. URLs de Referência

- **Facebook Developers Console**: https://developers.facebook.com/apps/742086725267609/
- **Instagram API Docs**: https://developers.facebook.com/docs/instagram-api/
- **NextAuth.js Docs**: https://next-auth.js.org/providers/instagram

---

## 🆘 Se Ainda Tiver Problemas

Envie uma screenshot da configuração do Facebook Developers mostrando:
1. As URLs de redirecionamento configuradas
2. O tipo de produto (Instagram API vs Basic Display)
3. O status da conexão da conta Instagram