import { Outlet } from 'react-router';
import { Header } from '../shared/components';

export function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
