import { Outlet } from 'react-router';
import { Header } from '../shared/components';
import Menu from '../shared/components/Menu/Menu';

export function App() {
  return (
    <>
      <Header />
      <Menu/>
      <Outlet />
    </>
  );
}
