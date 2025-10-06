
// AuthProvider hanterar autentisering och rollhantering för hela appen.
// Den exponerar login, logout, roll och inloggningsstatus via en React Context.
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { AuthContext } from ".";
import { loginReq } from "../api";
import { TOKENS } from "../constants";
import { ITokens, IAuthContext } from "../types";
import { CustomError } from "../../shared/classes";
import { jwtDecode } from "jwt-decode";




// Props för AuthProvider: tar emot children som ska ha tillgång till auth-contexten
interface IAuthProviderProps {
  children: ReactNode;
}


// JWT-payloadstruktur: används för att extrahera roll från accessToken
interface JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?:
    | "Teacher"
    | "Student";
  exp?: number;
  iat?: number;
}


  // State: inloggningsstatus och roll ("Teacher", "Student" eller null)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<"Teacher" | "Student" | null>(null);

  // useLocalStorage fungerar som useState men synkar alltid mot localStorage.
  // Om någon annan komponent ändrar tokens i LS, uppdateras denna komponent automatiskt.
  const [tokens, setTokens, clearTokens] = useLocalStorage<ITokens | null>(
    TOKENS,
    null
  );

  // login: anropar API, sparar tokens i localStorage (och därmed i state)
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

  // logout: rensar tokens, roll och inloggningsstatus
  function logout() {
    clearTokens();
    setRole(null);
    setIsLoggedIn(false);
  }


  // useEffect: körs när tokens ändras (t.ex. vid login/logout)
  // Om accessToken finns, decoda JWT och sätt roll + inloggad
  // Om decoding misslyckas, logga fel och nolla roll
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
        // Debug: visa decoded token i konsolen
        console.log(decodedToken);
      } catch (err) {
        console.error("Failed to decode JWT", err);
        setRole(null);
        setIsLoggedIn(!!tokens); // Om tokens finns, sätt inloggad ändå
      }
    } else {
      setRole(null);
      setIsLoggedIn(false);
    }
  }, [tokens]);


  // Värden som skickas ut via AuthContext till resten av appen
  const values: IAuthContext = { isLoggedIn, login, logout, role };

  // Returnerar context-provider med auth-data till alla barnkomponenter
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}



