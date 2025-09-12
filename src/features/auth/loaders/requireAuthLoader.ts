import { redirect, type LoaderFunctionArgs } from 'react-router';
import { validateOrRefreshTokens } from '../utilities';
import { TOKENS } from '../constants';
import { ITokens } from '../types';

export async function requireAuthLoader({ request }: LoaderFunctionArgs) {
  const raw = localStorage.getItem(TOKENS);
  const tokens = raw ? (JSON.parse(raw) as ITokens) : null;

  const next = await validateOrRefreshTokens(tokens);
  if (next) {
    // Update localStorage if refresh gave new tokens
    const nextRaw = JSON.stringify(next);
    if (nextRaw !== raw) {
      localStorage.setItem(TOKENS, nextRaw);
    }
    return null; // Let the route through
  }

  const url = new URL(request.url);
  const redirectTo = encodeURIComponent(url.pathname + url.search);

  console.log('Redirecting unauthenticated user => /login');
  throw redirect(`/login?redirectTo=${redirectTo}`);
}
