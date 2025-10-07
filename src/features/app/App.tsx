import { Outlet } from 'react-router';
import { Header } from '../shared/components';
import Menu from '../shared/components/Menu/component/Menu';

export function App() {
  return (
    <>
      <Header />
      <main className="main-layout">
        <Menu />
        <div className="menu">
          {/* tom på mobil, används bara för desktop layout */}
        </div>
        <div className="outlet-container">
          <Outlet />
        </div>
      </main>
    </>
  );
}
