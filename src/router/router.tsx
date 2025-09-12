import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import { App } from '../features/app';
import { Login } from '../features/auth/components';
import { requireAuthLoader } from '../features/auth/loaders';
import { Companies, Company } from '../features/companies/components';
import { companiesLoader, companyLoader } from '../features/companies/loaders';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* requireAuthLoader is a route guard that protects the App and its child routes. */}
      <Route element={<App />} loader={requireAuthLoader} path="/">
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
