import { companiesLoader } from '../companies/loaders/companiesLoader';
import { coursesLoader } from '../courses/loaders/courseLoader';

export async function homeLoader() {
  const companies = await companiesLoader().companies;
  const courses = await coursesLoader().then(res => res.courses);
  return { companies, courses };
}
