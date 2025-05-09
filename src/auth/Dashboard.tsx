import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyFetch, clearAuthData } from '../utils/utils';

interface UserProfile {
  display_name: string;
  images: { url: string }[];
  email: string;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await spotifyFetch('https://api.spotify.com/v1/me');
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleLogout = () => {
    clearAuthData();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#493D9E]">
        <div className="p-8 rounded-lg bg-black bg-opacity-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#493D9E]">
        <div className="p-8 rounded-lg bg-black bg-opacity-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#493D9E] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black bg-opacity-20 rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome to Mujik Player</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Disconnect Spotify
            </button>
          </div>

          {profile && (
            <div className="flex items-center space-x-6">
              {profile.images?.[0] && (
                <img
                  src={profile.images[0].url}
                  alt={profile.display_name}
                  className="w-24 h-24 rounded-full"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-white">{profile.display_name}</h2>
                <p className="text-gray-300">{profile.email}</p>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Your Music Library</h3>
            <p className="text-gray-300">
              You're now connected to Spotify! You can start using the player features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
