import { ReactElement, ReactNode, Suspense } from 'react';
import { Await, useLoaderData, useParams } from 'react-router';
import { ICourse, ICourseLoader } from '../types';

export function Course(): ReactElement {
  const { course } = useLoaderData<ICourseLoader>();
  const { id } = useParams();

  const renderCourse = (course: ICourse): ReactNode => (
    <article className="course">
      <h3>{course.name}</h3>
      <p>{course.description}</p>
      <p>Startdatum: {course.startDate}</p>
    </article>
  );

  return (
    <main className="course">
      <h2>Kursinformation för kurs {id}</h2>
      <Suspense fallback={<p>Loading...</p>}>
        <Await children={(course) => renderCourse(course)} resolve={course} />
      </Suspense>
    </main>
  );
}
