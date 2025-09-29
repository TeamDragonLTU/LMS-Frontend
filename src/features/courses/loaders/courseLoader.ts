export async function coursesLoader(): Promise<{ courses: ICourse[] }> {
  const courses: ICourse[] = await fetchWithToken('https://localhost:7213/api/course');
  return { courses };
}


import { ICourse } from '../types';
import { fetchWithToken } from '../../shared/utilities/fetchWithToken';
import { LoaderFunctionArgs } from 'react-router';

// Loader för enskild kurs, tar emot params från React Router
export async function courseLoader({ params }: LoaderFunctionArgs): Promise<{ course: ICourse }> {
  const course: ICourse = await fetchWithToken(`https://localhost:7213/api/course/${params.id}`);
  return { course };
}
