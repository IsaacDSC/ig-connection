import Image from 'next/image';
import { InstagramProfile } from '@/types/instagram';

interface InstagramProfileCardProps {
  profile: InstagramProfile;
  loading?: boolean;
  onRefresh?: () => void;
}

export default function InstagramProfileCard({ 
  profile, 
  loading = false, 
  onRefresh 
}: InstagramProfileCardProps) {
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      {/* Header */}
      <div className="ml-gradient-secondary px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Perfil do Instagram
          </h2>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
              title="Atualizar perfil"
            >
              <svg
                className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto md:mx-0">
              {profile.profile_picture_url ? (
                <Image
                  src={profile.profile_picture_url}
                  alt={`${profile.username} profile picture`}
                  fill
                  className="rounded-full object-cover border-4 border-white ml-shadow-primary"
                  sizes="(max-width: 768px) 96px, 128px"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center border-4 border-white shadow-lg">
                  <svg
                    className="w-12 h-12 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.name || profile.username}
              </h3>
              <p className="text-gray-600 text-lg">@{profile.username}</p>
              <div className="inline-flex items-center px-2 py-1 mt-2 bg-blue-50 ml-text-secondary text-sm rounded-full">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {profile.account_type}
              </div>
            </div>

            {/* Biography */}
            {profile.biography && (
              <div className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {profile.biography}
                </p>
              </div>
            )}

            {/* Website */}
            {profile.website && (
              <div className="mb-4">
                <a
                  href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center ml-text-secondary ml-hover-secondary text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(profile.media_count)}
                </div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(profile.followers_count)}
                </div>
                <div className="text-sm text-gray-600">Seguidores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(profile.follows_count)}
                </div>
                <div className="text-sm text-gray-600">Seguindo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}