import { FormEventHandler, ReactElement, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthContext } from '../hooks/useAuthContext';

export function Login(): ReactElement {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [searchParams] = useSearchParams();
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await login(username, password);

    const redirectTo = searchParams.get('redirectTo') || '/';
    navigate(redirectTo, { replace: true });
  };

  return (
    <main id="login-page" className="g-container">
      <form className="login-form" onSubmit={handleOnSubmit}>
        <fieldset>
          <legend>Login</legend>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            value={username}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
          />
          <button type="submit">Submit</button>
        </fieldset>
      </form>
    </main>
  );
}
