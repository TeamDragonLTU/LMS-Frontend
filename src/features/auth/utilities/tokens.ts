import { TOKENS } from '../constants/index.ts';
import { ITokens } from '../types/index.ts';

export function getTokens(): ITokens | null {
  const raw = localStorage.getItem(TOKENS);
  return raw ? (JSON.parse(raw) as ITokens) : null;
}

export function setTokens(newTokens: ITokens) {
  localStorage.setItem(TOKENS, JSON.stringify(newTokens));
}
