import '../../../css/lmslist.css';
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
    <section className="lmslist-container">
      <h1 className="lmslist-title">Dina kurser</h1>
      <ul className="lmslist-list">
        {courses.map((course) => (
          <li key={course.id}>
            <div className="lmslist-info">
              <span className="lmslist-name">{course.name}</span>
              <span className="lmslist-email">{course.description}</span>
            </div>
            <Link className="lmslist-role-badge" to={`/course/${course.id}`}>Se kursinfo</Link>
          </li>
        ))}
      </ul>
    </section>

   
  );
}
