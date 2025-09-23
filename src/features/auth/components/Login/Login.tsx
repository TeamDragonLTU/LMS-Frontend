import { FormEventHandler, ReactElement, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { BookOpenIcon, LogInIcon } from "lucide-react";
import { useAuthContext } from "../../hooks";

export function Login(): ReactElement {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [searchParams] = useSearchParams();
  const { login } = useAuthContext();

  const navigate = useNavigate();

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await login(username, password);

    const redirectTo = searchParams.get("redirectTo") || "/";
    navigate(redirectTo, { replace: true });
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
            <label htmlFor="username">E-postadress</label>
            <input
              className="input"
              onChange={(e) => setUsername(e.target.value)}
              type="email"
              value={username}
            />
            <br />
            <label htmlFor="password">Lösenord</label>
            <br />
            <input
              className="input"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
            />
            <button type="submit" className="button">
              <LogInIcon />
              Logga in
            </button>
          </form>
        </fieldset>
      </main>
    </div>
  );
}
