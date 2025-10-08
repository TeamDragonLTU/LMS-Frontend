import { FormEventHandler, ReactElement, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { BookOpenIcon, LogInIcon, AlertCircle } from "lucide-react";
import "./Login.css";
import { useAuthContext } from "../../hooks";


export function Login(): ReactElement {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [searchParams] = useSearchParams();
  const { login } = useAuthContext();
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      const redirectTo = searchParams.get("redirectTo") || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (typeof err === "string") {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ett fel uppstod vid inloggning. Försök igen eller kontakta support om problemet kvarstår.");
      }
    }
  };

  return (
    <div className="LoginContainer">
      <main id="login-page" className="loginPage">
        <fieldset className="loginfieldset">
          <div className="icon">
            <BookOpenIcon />
          </div>
          <h1 className="header">Lexicon LMS</h1>
          <form className="login-form" onSubmit={handleOnSubmit}>
            <label htmlFor="login-username">E-postadress:</label>
            <input
              id="login-username"
              name="username"
              className="input"
              onChange={(e) => setUsername(e.target.value)}
              type="email"
              value={username}
              autoComplete="username"
            />
            <label htmlFor="login-password">Lösenord:</label>
            <input
              id="login-password"
              name="password"
              className="input"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
              autoComplete="current-password"
            />
            {error && (
              <div className="error-message">
                <AlertCircle color="#b00020" />
                {error}
              </div>
            )}
            <button type="submit" className="login-button">
              <LogInIcon />
              Logga in
            </button>
          </form>
        </fieldset>
      </main>
    </div>
  );
}
