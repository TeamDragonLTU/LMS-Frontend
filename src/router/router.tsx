import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import { Login } from '../features/auth';
import { App } from '../features/app';
import { Companies } from '../features/companies';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route index element={<Companies />} />
      </Route>
      <Route element={<Login />} path="/login" />
    </>
  )
);
