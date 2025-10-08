import { thisWeeksActivitiesLoader } from './ThisWeeksActivities/loaders/thisWeeksActivitiesLoader';

export async function homeLoader() {
  const { activities } = await thisWeeksActivitiesLoader();
  return {  activities };
}
