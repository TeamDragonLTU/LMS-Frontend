import { decodeJwt } from './decodeJwt';

export function decodeRoleFromJwt(token: string): string | null {
  const payload = decodeJwt(token);
  if (!payload) return null;
  // För Azure AD och vissa .NET-backends kan rollen ligga på custom-claim
  // Prova vanliga och custom-claim-nycklar
  if (payload.role) {
    if (Array.isArray(payload.role)) return payload.role[0] || null;
    return payload.role;
  }
  // Kolla vanliga custom-claim-nycklar
  for (const key of Object.keys(payload)) {
    if (key.toLowerCase().includes('role')) {
      const val = payload[key];
      if (Array.isArray(val)) return val[0] || null;
      if (typeof val === 'string') return val;
    }
  }
  return null;
}
