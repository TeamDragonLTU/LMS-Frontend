import { Outlet } from 'react-router';
import { Header } from '../shared/components';
import Menu from '../shared/components/Menu/component/Menu';

export function App() {
  return (
    <>
      <Header />
      <main className="main-layout">
        <div className="menu">
          <Menu />
        </div>
        <div className="outlet-container">
          <Outlet />
        </div>  
      </main>
    </>
  );
}
