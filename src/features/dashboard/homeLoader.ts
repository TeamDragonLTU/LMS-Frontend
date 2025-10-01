import { companiesLoader } from '../companies/loaders/companiesLoader';
import { thisWeeksActivitiesLoader } from './ThisWeeksActivities/loaders/thisWeeksActivitiesLoader';

export async function homeLoader() {
  const companies = await companiesLoader().companies;
  const { activities } = await thisWeeksActivitiesLoader();
  return { companies, activities };
}
