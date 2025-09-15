// Configurações centralizadas da aplicação
export const INSTAGRAM_CONFIG = {
  CLIENT_ID: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
  SCOPES: [
    'instagram_business_basic',
    'instagram_business_manage_messages',
    'instagram_business_manage_insights'
  ].join(','),
  BASE_AUTH_URL: "https://www.instagram.com/oauth/authorize",
  TOKEN_URL: "https://api.instagram.com/oauth/access_token",
  GRAPH_API_URL: "https://graph.instagram.com"
} as const;

export const getRedirectUri = (origin?: string) => {
  return process.env.NEXT_PUBLIC_REDIRECT_URI ||
    `${origin || (typeof window !== 'undefined' ? window.location.origin : '')}/api/auth/callback/instagram`;
};

export const getDashboardUrl = () => {
  return `${process.env.INSTAGRAM_API_BASE_URL}/dashboard`
};
