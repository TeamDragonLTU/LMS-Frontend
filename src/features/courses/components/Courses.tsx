import '../css/Courses.css';
import { ReactElement } from 'react';
import { useLoaderData, Link } from 'react-router';
import { ICourse } from '../types';

export function Courses(): ReactElement {
  const loaderData = useLoaderData() as { courses?: ICourse[] } | ICourse[] | undefined;
  let courses: ICourse[] = [];
  if (loaderData) {
    if (Array.isArray(loaderData)) {
      courses = loaderData;
    } else if ('courses' in loaderData && Array.isArray(loaderData.courses)) {
      courses = loaderData.courses;
    }
  }
  if (!courses || courses.length === 0) return <p>Inga kurser...</p>;

  return (
    <section className="courses">
      <h2>Dina kurser</h2>
      {courses.map((course) => (
        <div key={course.id}>
          <p>{course.name}</p>
          <Link to={"/course"}>Se kursinfo</Link>
        </div>
      ))}
    </section>
  );
}
