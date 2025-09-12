import { ReactElement } from 'react';
import { Navigate } from 'react-router';
import { useAuthContext } from '../features/auth';

interface IProtectedRoute {
  children: ReactElement;
}

export function RequireAuth({ children }: IProtectedRoute): ReactElement {
  const { isLoggedIn } = useAuthContext();

  if (isLoggedIn === false) {
    return <Navigate to="/login" />;
  }

  return children;
}
