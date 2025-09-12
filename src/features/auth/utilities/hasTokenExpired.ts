import { jwtDecode } from 'jwt-decode';

type Jwt = { exp?: number };

export function hasTokenExpired(token: string): boolean {
  if (!token) return true;
  const { exp } = jwtDecode<Jwt>(token) || {};

  if (!exp) return true; // saknar exp - behandla som utgången
  return Date.now() >= exp * 1000; // exp i sekunder - ms
}
