import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import { App } from '../features/app';
import { Login } from '../features/auth/components';
import { requireAuthLoader } from '../features/auth/loaders';
import { Home } from '../features/home/Home';
import { homeLoader } from '../features/home/homeLoader';
import { Company } from '../features/companies/components';
import { companyLoader } from '../features/companies/loaders';
import { Course } from '../features/courses/components/Course';
import { courseLoader } from '../features/courses/loaders/courseLoader';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* requireAuthLoader is a route guard that protects the App and its child routes. */}
      <Route element={<App />} loader={requireAuthLoader} path="/">
        <Route element={<Home />} index loader={homeLoader} />
        <Route
          element={<Company />}
          loader={({ params }) => {
            return companyLoader(params.id);
          }}
          path="companies/:id"
        />
        <Route
          element={<Course />}
          loader={courseLoader}
          path="course"
        />
      </Route>
      <Route element={<Login />} path="/login" />
    </>
  )
);
