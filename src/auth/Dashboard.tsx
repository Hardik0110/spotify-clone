import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyFetch, clearAuthData, isTokenExpired, getAuthData } from '../utils/utils';

interface SpotifyProfile {
  email: string;
  display_name: string;
  followers: { total: number };
  images: { url: string }[];
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
}

export default function Dashboard() {
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!getAuthData('spotify_access_token') || isTokenExpired()) {
      navigate('/');
      return;
    }

    async function fetchUserData() {
      try {
        // Fetch user profile
        const profileResponse = await spotifyFetch('https://api.spotify.com/v1/me');
        const profileData = await profileResponse.json();
        setProfile(profileData);

        // Fetch user playlists
        const playlistsResponse = await spotifyFetch('https://api.spotify.com/v1/me/playlists?limit=10');
        const playlistsData = await playlistsResponse.json();
        setPlaylists(playlistsData.items || []);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    clearAuthData();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212]">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212]">
        <div className="p-8 rounded-lg bg-black bg-opacity-20 text-center">
          <p className="text-white mb-4">{error}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-[#1DB954] text-white font-bold"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mujik Player</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-[#1DB954] text-white font-bold"
          >
            Logout
          </button>
        </div>

        {profile && (
          <div className="mb-8 p-6 bg-[#181818] rounded-lg">
            <div className="flex items-center">
              {profile.images && profile.images[0] && (
                <img
                  src={profile.images[0].url}
                  alt="Profile"
                  className="w-16 h-16 rounded-full mr-4"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">{profile.display_name}</h2>
                <p className="text-gray-400">{profile.email}</p>
                <p className="text-gray-400">
                  {profile.followers ? `${profile.followers.total} followers` : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="p-4 bg-[#181818] rounded-lg hover:bg-[#282828] transition-colors">
                {playlist.images && playlist.images[0] && (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-full aspect-square object-cover mb-2 rounded"
                  />
                )}
                <h3 className="font-bold truncate">{playlist.name}</h3>
                <p className="text-gray-400 text-sm">
                  {playlist.tracks.total} tracks
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No playlists found</p>
        )}
      </div>
    </div>
  );
}
