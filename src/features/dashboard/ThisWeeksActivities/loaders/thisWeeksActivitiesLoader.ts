import { fetchWithToken } from '../../../shared/utilities/fetchWithToken';

export async function thisWeeksActivitiesLoader() {
  try {
    const data = await fetchWithToken<any>('https://localhost:7213/api/course/my');
    let acts: any[] = [];
    if (data && data.modules && Array.isArray(data.modules)) {
      data.modules.forEach((mod: any) => {
        if (mod.activities && Array.isArray(mod.activities)) {
          acts = acts.concat(mod.activities.map((a: any) => ({
            ...a,
            moduleName: mod.name
          })));
        }
      });
    }
    // Filtrera på aktiviteter denna vecka
    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const filtered = acts.filter((a: any) => {
      const start = new Date(a.startTime);
      return getWeekNumber(start) === currentWeek && start.getFullYear() === now.getFullYear();
    });
    return { activities: filtered };
  } catch (err) {
    throw new Response('Inga aktiviteter denna vecka', { status: 500 });
  }
}

function getWeekNumber(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1) / 7);
}
