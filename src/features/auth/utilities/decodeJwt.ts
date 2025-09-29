import { jwtDecode } from "jwt-decode";

export interface IJwtPayload {
  sub: string;
  name?: string;
  email?: string;
  role?: string | string[];
  [key: string]: any;
}

export function decodeJwt(token: string): IJwtPayload | null {
  try {
    return jwtDecode<IJwtPayload>(token);
  } catch {
    return null;
  }
}
