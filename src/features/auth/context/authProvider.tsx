import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { AuthContext } from '.';
import { loginReq } from '../api';
import { TOKENS } from '../constants';
import { ITokens, IAuthContext } from '../types';
import { CustomError } from '../../shared/classes';

interface IAuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: IAuthProviderProps): ReactElement {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // useLocalStorage works as a useState but it is always hooked up to LS, which means, if another component updates LS, this component will update as well.
  const [tokens, setTokens, clearTokens] = useLocalStorage<ITokens | null>(TOKENS, null);

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

  const values: IAuthContext = { isLoggedIn, login, logout };

  useEffect(() => {
    if (tokens === null) setIsLoggedIn(false);
    if (tokens) setIsLoggedIn(true);
  }, [tokens]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
