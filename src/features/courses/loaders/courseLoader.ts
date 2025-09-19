export async function coursesLoader(): Promise<{ courses: ICourse[] }> {
  const courses: ICourse[] = await fetchWithToken('https://localhost:7213/api/course');
  return { courses };
}
import { ICourse } from '../types';
import { fetchWithToken } from '../../shared/utilities/fetchWithToken';

export async function courseLoader(): Promise<{ course: ICourse }> {
  const courses: ICourse[] = await fetchWithToken('https://localhost:7213/api/course');
  // Returnera första kursen, eller anpassa efter behov
  return { course: courses[0] };
}
