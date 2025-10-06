import { useEffect, useState } from 'react';
import { getTokens } from '../utilities/tokens';
import { decodeRoleFromJwt } from '../utilities/decodeRoleFromJwt';

export function useRole(): string | null {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const tokens = getTokens();
    if (!tokens?.accessToken) {
      setRole(null);
      return;
    }
    const foundRole = decodeRoleFromJwt(tokens.accessToken);
    setRole(foundRole);
  }, []);

  return role;
}
