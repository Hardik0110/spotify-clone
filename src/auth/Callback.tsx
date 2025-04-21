import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, saveAuthData } from '../utils/utils';

const CLIENT_ID = 'f29485f82aba428f9f058c89fa168371';
const REDIRECT_URI = 'https://localhost:5173/callback';

export default function Callback() {
  const [status, setStatus] = useState('Loading...');
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get('code');
      const state = queryParams.get('state');
      const error = queryParams.get('error');
      
      // Check for errors or missing code
      if (error || !code) {
        setStatus(`Authentication error: ${error}`);
        setTimeout(() => navigate('/'), 3000);
        return;
      }
      
      // Verify state to prevent CSRF attacks
      const storedState = getAuthData('spotify_auth_state');
      if (!state || state !== storedState) {
        setStatus('State verification failed');
        setTimeout(() => navigate('/'), 3000);
        return;
      }
      
      // Get the code verifier that was stored before the auth request
      const codeVerifier = getAuthData('spotify_code_verifier');
      if (!codeVerifier) {
        setStatus('Code verifier not found');
        setTimeout(() => navigate('/'), 3000);
        return;
      }
      
      try {
        // Exchange the authorization code for an access token
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier,
          }),
        });
        
        const data = await tokenResponse.json();
        
        if (data.error) {
          setStatus(`Token error: ${data.error}`);
          setTimeout(() => navigate('/'), 3000);
          return;
        }
        
        // Save tokens to localStorage
        saveAuthData('spotify_access_token', data.access_token);
        saveAuthData('spotify_refresh_token', data.refresh_token);
        saveAuthData('spotify_token_expires_at', String(Date.now() + data.expires_in * 1000));
        
        // Clean up the URL parameters and state
        window.history.replaceState({}, document.title, '/callback');
        
        setStatus('Authentication successful!');
        
        // Redirect to the dashboard
        setTimeout(() => navigate('/dashboard'), 1000);
      } catch (error) {
        console.error('Token exchange error:', error);
        setStatus('Failed to exchange token');
        setTimeout(() => navigate('/'), 3000);
      }
    }
    
    handleCallback();
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#493D9E]">
      <div className="p-8 rounded-lg bg-black bg-opacity-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Spotify Authentication</h1>
        <p className="text-white">{status}</p>
      </div>
    </div>
  );
}
