// utils.js - Helper functions for Spotify authentication with PKCE

// Generate a random string for the state parameter
interface RandomStringGenerator {
    (length: number): string;
}

export const generateRandomString: RandomStringGenerator = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc: string, x: number) => acc + possible[x % possible.length], "");
};
  
  // Generate a code verifier (random string between 43-128 characters)
  export function generateCodeVerifier() {
    return generateRandomString(64);
  }
  
  // Generate a code challenge from the code verifier
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}
  
  // Save auth data to localStorage
export function saveAuthData(key: string, value: string): void {
    window.localStorage.setItem(key, value);
}
  
  // Get auth data from localStorage
export function getAuthData(key: string): string | null {
    return window.localStorage.getItem(key);
}
  
  // Clear auth data from localStorage
  export function clearAuthData() {
    window.localStorage.removeItem('spotify_access_token');
    window.localStorage.removeItem('spotify_refresh_token');
    window.localStorage.removeItem('spotify_token_expires_at');
    window.localStorage.removeItem('spotify_code_verifier');
  }
  
  // Check if the access token is expired
  export function isTokenExpired() {
    const expiresAt = getAuthData('spotify_token_expires_at');
    if (!expiresAt) return true;
    
    return Date.now() > parseInt(expiresAt);
  }
  
  // Refresh the access token
  export async function refreshAccessToken() {
    const refreshToken = getAuthData('spotify_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
  
    const clientId = 'f29485f82aba428f9f058c89fa168371';
    
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });
    
    const data = await response.json();
    
    if (data.access_token) {
      saveAuthData('spotify_access_token', data.access_token);
      saveAuthData('spotify_token_expires_at', String(Date.now() + data.expires_in * 1000));
      
      if (data.refresh_token) {
        saveAuthData('spotify_refresh_token', data.refresh_token);
      }
      
      return data.access_token;
    } else {
      throw new Error('Failed to refresh access token');
    }
  }
  
  // Get a valid access token (refreshes if needed)
  export async function getValidAccessToken() {
    if (isTokenExpired()) {
      try {
        return await refreshAccessToken();
      } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
      }
    }
    
    return getAuthData('spotify_access_token');
  }
  
  // Make authenticated requests to Spotify API
interface SpotifyRequestOptions extends RequestInit {
    headers?: HeadersInit;
}

export async function spotifyFetch(url: string, options: SpotifyRequestOptions = {}): Promise<Response> {
    const token = await getValidAccessToken();
    
    if (!token) {
        throw new Error('No valid access token');
    }
    
    const headers = {
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    return fetch(url, {
        ...options,
        headers
    });
}
  