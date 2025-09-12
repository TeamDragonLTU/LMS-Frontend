import { CustomError } from '../../shared/classes';
import { BASE_URL } from '../../shared/constants';
import { fetchWithToken } from '../../shared/utilities';
import { ICompany, ICompanyLoader } from '../types';

export function companyLoader(id?: string): ICompanyLoader {
  if (!id) throw new Response('Missing id', { status: 400 });

  try {
    const data = fetchWithToken<ICompany>(`${BASE_URL}/companies/${id}`);
    return { company: data }; // Returns a promise, use with suspens/await
  } catch (e) {
    if (e instanceof CustomError && e.errorCode === 401) {
      throw new Response('Unauthorized', { status: 401 });
      // TODO: This throws a 401 Response. Without a custom errorElement,
      //       React Router will show its default error page.
      //       You should implement your own logic here (e.g. redirect
      //       to /login or render a friendly error message).
    }

    const msg = e instanceof Error ? e.message : 'Failed to load companies';
    throw new Response(msg, { status: 502 });
  }
}
