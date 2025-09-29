import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import { App } from "../features/app";
import { Login } from "../features/auth/components/Login";
import { requireAuthLoader } from "../features/auth/loaders";

// From dev-skapa-meny
import { Companies, Company } from "../features/companies/components";
import { companiesLoader, companyLoader } from "../features/companies/loaders";

import UsersPage from "../features/usersboard/component/index";

// From dev
import { Home } from "../features/dashboard/Home";
import { homeLoader } from "../features/dashboard/homeLoader";
import { Course } from "../features/courses/components/Course";
import { courseLoader } from "../features/courses/loaders/courseLoader";
import { courseParticipantsLoader } from "../features/course-participants/loaders/courseParticipantsLoader";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* requireAuthLoader is a route guard that protects the App and its child routes. */}
      <Route element={<App />} loader={requireAuthLoader} path="/">
        {/* Default route for "/" */}
        <Route index element={<Home />} loader={homeLoader} />

        {/* Dashboard + Users */}
        <Route path="dashboard" element={<Home />} loader={homeLoader} />
        <Route
          path="users"
          element={<UsersPage />}
          loader={courseParticipantsLoader}
        />

        {/* Companies */}
        <Route element={<Companies />} index loader={companiesLoader} />
        <Route
          element={<Company />}
          loader={({ params }) => companyLoader(params.id)}
          path="companies/:id"
        />

        {/* Courses */}
        <Route element={<Course />} loader={courseLoader} path="course" />
      </Route>
      <Route element={<Login />} path="/login" />
    </>
  )
);
