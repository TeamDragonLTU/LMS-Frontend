

import React, { ReactElement } from 'react';
import { useLoaderData, useParams } from 'react-router';
import { ICourse, ICourseLoader } from '../types';
import '../../../css/lmslist.css';

export function Course(): ReactElement {
  const { course } = useLoaderData<ICourseLoader>();
  const { id } = useParams();

  return (
    <main className="lmslist-container">
      <h2 className="lmslist-title">{course.name}</h2>
      <p className="lmslist-subtitle">{course.description}</p>
      <p style={{marginBottom: '2rem'}}>Startdatum: {course.startDate}</p>
    </main>
  );
}
