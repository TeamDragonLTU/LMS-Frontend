import React, { ReactElement } from 'react';
import { useLoaderData, useParams } from 'react-router';
import { ICourse, ICourseLoader } from '../types';
import '../../../css/lmslist.css';
import ModuleStudent from '../ModuleStudent/component/ModuleStudent';
 
export function Course(): ReactElement {
  const { course } = useLoaderData<ICourseLoader>();
  const { id } = useParams();
 
  return (
<main className="lmslist-container">
<h2 className="lmslist-title">{course.name}</h2>
<p className="lmslist-subtitle">{course.description}</p>
<p style={{marginBottom: '2rem'}}>Startdatum: {course.startDate}</p>
<main className="course">
<h2>Kursinformation för kurs {id}</h2>
<Suspense fallback={<p>Loading...</p>}>
<Await children={(course) => renderCourse(course)} resolve={course} />
</Suspense>
<ModuleStudent/>
</main>
  );
}