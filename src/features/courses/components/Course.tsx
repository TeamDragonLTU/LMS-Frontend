import React, { ReactElement } from 'react';
import { useLoaderData } from 'react-router';
import { ICourseLoader } from '../types';
import '../../../css/lmslist.css';

export function Course(): ReactElement {
  const { course } = useLoaderData<ICourseLoader>();

  return (
    <main className="lmslist-container">
      <h2 className="lmslist-title">{course.name}</h2>
      <p className="lmslist-subtitle">{course.description}</p>
      <p className="course-startdate">Startdatum: {course.startDate}</p>
    </main>
  );
}