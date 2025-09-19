import { refreshTokens } from '../../auth/api';
import { getTokens, hasTokenExpired, setTokens, addTokenToRequestInit, clearTokens } from '../../auth/utilities';
import { CustomError } from '../classes';
import { fetchJson } from './fetchJson';

// Loader-friendly fetch with token-refresh
export async function fetchWithToken<T>(input: RequestInfo | URL, options?: RequestInit): Promise<T> {
  let tokens = getTokens();

  if (!tokens) {
    // No token => let guard handle redirect higher up
    throw new CustomError(401, 'No tokens');
  }

  // Renew if needed
  if (hasTokenExpired(tokens.accessToken)) {
    try {
      const refreshed = await refreshTokens(tokens.accessToken, tokens.refreshToken);
      setTokens(refreshed);
      tokens = refreshed;
    } catch {
      throw new CustomError(401, 'Token refresh failed');
    }
  }

  // Invoke the fetch with Authorization
  const reqInit = addTokenToRequestInit(tokens.accessToken, {
    ...options,
    headers: { Accept: 'application/json', ...(options?.headers || {}) },
  });

  return fetchJson<T>(input, reqInit);
    try {
      // ...existing fetch logic...
    } catch (error: any) {
      // Om token-refresh misslyckas, logga ut och redirecta
      const status = error?.status || error?.response?.status;
      const message = typeof error?.message === 'string' ? error.message.toLowerCase() : '';
      if (
        status === 401 ||
        status === 403 ||
        message.includes('token')
      ) {
            clearTokens(); // Rensa tokens
        window.location.href = '/login'; // Redirect till login
      }
      throw error;
    }
}
