import { Outlet } from 'react-router';
import { Header } from '../shared';
import { LoginStatusChip } from '../auth';

export function App() {
  return (
    <>
      <Header />
      <Outlet />
      <LoginStatusChip />
    </>
  );
}
