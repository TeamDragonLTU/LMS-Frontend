
// AuthProvider hanterar autentisering och rollhantering för hela applikationen.
// Den exponerar login, logout, roll och inloggningsstatus via en React Context till resten av appen.
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { AuthContext } from ".";
import { loginReq } from "../api";
import { TOKENS } from "../constants";
import { ITokens, IAuthContext } from "../types";
import { CustomError } from "../../shared/classes";
import { jwtDecode } from "jwt-decode";




// Props för AuthProvider: tar emot children (alla komponenter som ska ha tillgång till auth-contexten)
interface IAuthProviderProps {
  children: ReactNode;
}


// JWT-payloadstruktur: används för att extrahera roll från accessToken (t.ex. "Teacher" eller "Student")
interface JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?:
    | "Teacher"
    | "Student";
  exp?: number;
  iat?: number;
}



// Själva AuthProvider-komponenten
export function AuthProvider({ children }: IAuthProviderProps): ReactElement {
  // State: håller reda på om användaren är inloggad och vilken roll den har ("Teacher", "Student" eller null)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<"Teacher" | "Student" | null>(null);

  // useLocalStorage fungerar som useState men synkar alltid mot localStorage.
  // Om någon annan komponent ändrar tokens i localStorage, uppdateras denna komponent automatiskt.
  const [tokens, setTokens, clearTokens] = useLocalStorage<ITokens | null>(
    TOKENS,
    null
  );

  // login: anropar API, sparar tokens i localStorage (och därmed i state). Används vid inloggning.
  async function login(username: string, password: string) {
    try {
      const tokens = await loginReq(username, password);
      setTokens(tokens);
      return;
    } catch (error) {
      // Visa alltid ett svenskt felmeddelande
      throw 'Ett fel uppstod vid inloggning. Försök igen eller kontakta support om problemet kvarstår.';
    }
  }

  // logout: rensar tokens, roll och inloggningsstatus. Används vid utloggning.
  function logout() {
    clearTokens();
    setRole(null);
    setIsLoggedIn(false);
  }

  // useEffect: körs varje gång tokens ändras (t.ex. vid login eller logout)
  // Om accessToken finns, decoda JWT och sätt roll samt inloggningsstatus
  // Om decoding misslyckas, logga fel och nollställ roll och inloggningsstatus
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
        // Debug: visa decoded token i konsolen (för utveckling)
        console.log(decodedToken);
      } catch (err) {
        console.error("Failed to decode JWT", err);
        setRole(null);
        setIsLoggedIn(!!tokens); // Om tokens finns, sätt inloggad ändå (fallback)
      }
    } else {
      setRole(null);
      setIsLoggedIn(false);
    }
  }, [tokens]);

  // Värden som skickas ut via AuthContext till resten av applikationen
  const values: IAuthContext = { isLoggedIn, login, logout, role };

  // Returnerar context-provider med auth-data till alla barnkomponenter (children)
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}



