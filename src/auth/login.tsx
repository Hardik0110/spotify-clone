import { useState } from 'react';
import { generateCodeVerifier, generateCodeChallenge, saveAuthData, generateRandomString } from '../utils/utils';

const CLIENT_ID = 'f29485f82aba428f9f058c89fa168371';
const REDIRECT_URI = 'https://localhost:5173/callback';

const scopes = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-library-read',
  'user-library-modify',
  'user-read-playback-state',
  'user-modify-playback-state'
];

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setIsLoading(true);
    
    try {
      // Generate and store PKCE code verifier
      const codeVerifier = generateCodeVerifier();
      saveAuthData('spotify_code_verifier', codeVerifier);
      
      // Generate code challenge from verifier
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      // Generate random state
      const state = generateRandomString(16);
      saveAuthData('spotify_auth_state', state);
      
      // Build authorization URL with PKCE parameters
      const authUrl = new URL('https://accounts.spotify.com/authorize');
      const params = {
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        state: state,
        scope: scopes.join(' ')
      } as const;
      
      // Add query parameters to URL
      Object.entries(params).forEach(([key, value]) => 
        authUrl.searchParams.append(key, value)
      );
      
      // Redirect to Spotify authorization page
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#493D9E]">
      <div className="p-8 rounded-lg bg-black bg-opacity-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Mujik Player</h1>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="inline-block px-6 py-3 rounded-full bg-[#1DB954] text-white font-bold hover:bg-[#1ed760] transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Connecting...' : 'Connect with Spotify'}
        </button>
      </div>
    </div>
  );
}
