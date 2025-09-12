import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { AuthContext, IAuthContext, ITokens, loginReq, TOKENS } from '..';
import { CustomError } from '../../shared';

interface IAuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: IAuthProviderProps): ReactElement {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [tokens, setTokens, clearTokens] = useLocalStorage<ITokens | null>(TOKENS, null);
  const values: IAuthContext = { isLoggedIn, login, logout };

  async function login(username: string, password: string) {
    try {
      const tokens = await loginReq(username, password);
      setTokens(tokens);
    } catch (error) {
      if (error instanceof CustomError) {
        console.log(error);
      }
    }
  }

  function logout() {
    clearTokens();
  }

  useEffect(() => {
    if (tokens === null) setIsLoggedIn(false);
    if (tokens) setIsLoggedIn(true);
  }, [tokens]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
