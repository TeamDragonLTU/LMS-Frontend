import { hasTokenExpired } from '.';
import { refreshTokens } from '../api';
import { ITokens } from '../types';

export async function validateOrRefreshTokens(tokens: ITokens | null): Promise<ITokens | null> {
  if (!tokens) return null;

  // AccessTokens still valid
  if (!hasTokenExpired(tokens.accessToken)) return tokens;

  // Try refresh tokens
  try {
    const refreshedTokens = await refreshTokens(tokens.accessToken, tokens.refreshToken);
    return refreshedTokens ?? null;
  } catch {
    return null;
  }
}
