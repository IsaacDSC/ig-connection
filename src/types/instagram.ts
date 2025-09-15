export interface InstagramMedia {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  insights?: {
    data: Array<{
      name: string;
      values: Array<{ value: number }>;
    }>;
  };
  insightsError?: {
    reason: string;
    message: string;
    details?: string;
  };
}

export interface RawInstagramMedia {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

export interface InstagramProfile {
  id: string;
  user_id: string;
  name: string;
  username: string;
  biography?: string;
  website?: string;
  account_type: string;
  profile_picture_url: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
}

export interface InstagramSession {
  user_id: string;
  access_token: string;
}

export interface InstagramSessionResponse {
  status: 'success' | 'error';
  message: string;
  authenticated: boolean;
  data?: InstagramSession;
  error?: string;
}
