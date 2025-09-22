import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import { App } from '../features/app';
import { Login } from '../features/auth/components';
import { requireAuthLoader } from '../features/auth/loaders';
import { Companies, Company } from '../features/companies/components';
import { companiesLoader, companyLoader } from '../features/companies/loaders';
import DashboardPage from '../features/dashboard/component/index';
import UsersPage from '../features/usersboard/component/index';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* requireAuthLoader is a route guard that protects the App and its child routes. */}
      <Route element={<App />} loader={requireAuthLoader} path="/">
       {/* Default route for "/" */}
        <Route index element={<DashboardPage />} />
        {/* Menu routes */}
        <Route path="dashboard" element={<DashboardPage />} />
  
        <Route path="users" element={<UsersPage />} />
        <Route element={<Companies />} index loader={companiesLoader} />
        <Route
          element={<Company />}
          loader={({ params }) => {
            return companyLoader(params.id);
          }}
          path="companies/:id"
        />
      </Route>
      <Route element={<Login />} path="/login" />
    </>
  )
);
