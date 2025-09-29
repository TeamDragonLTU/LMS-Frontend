import { companiesLoader } from '../companies/loaders/companiesLoader';

export async function homeLoader() {
  const companies = await companiesLoader().companies;
  return { companies };
}
