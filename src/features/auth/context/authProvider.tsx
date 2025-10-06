import { ReactElement, ReactNode, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { AuthContext } from ".";
import { loginReq } from "../api";
import { TOKENS } from "../constants";
import { ITokens, IAuthContext } from "../types";
import { CustomError } from "../../shared/classes";
import { jwtDecode } from "jwt-decode";

interface IAuthProviderProps {
  children: ReactNode;
}

interface JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?:
    | "Teacher"
    | "Student";
  exp?: number;
  iat?: number;
}

export function AuthProvider({ children }: IAuthProviderProps): ReactElement {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<"Teacher" | "Student" | null>(null);

  // useLocalStorage works as a useState but it is always hooked up to LS, which means, if another component updates LS, this component will update as well.
  const [tokens, setTokens, clearTokens] = useLocalStorage<ITokens | null>(
    TOKENS,
    null
  );
  async function login(username: string, password: string) {
    try {
      const tokens = await loginReq(username, password);
      setTokens(tokens);
    } catch (error) {
      if (error instanceof CustomError) {
        console.error(error);
      }
    }
  }

  function logout() {
    clearTokens();
    setRole(null);
    setIsLoggedIn(false);
  }

  useEffect(() => {
    if (tokens?.accessToken) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(tokens.accessToken);
        const roleFromToken =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] ?? null;

        setRole(roleFromToken);
        setIsLoggedIn(true);
        console.log(decodedToken);
      } catch (err) {
        console.error("Failed to decode JWT", err);
        setRole(null);
        setIsLoggedIn(false);
      }
    } else {
      setRole(null);
      setIsLoggedIn(false);
    }
  }, [tokens]);

  const values: IAuthContext = { isLoggedIn, login, logout, role };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
