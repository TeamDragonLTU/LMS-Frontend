import { CustomError } from '../classes';

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) throw new CustomError(res.status, res.statusText || 'Request failed');
  return res.json() as Promise<T>;
}
