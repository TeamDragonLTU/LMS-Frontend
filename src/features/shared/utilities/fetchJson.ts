import { CustomError } from "../classes";

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
console.log('res', res);

  if (!res.ok) {
    console.log('NOT OK');
    let errorData;
    
    try {
      errorData = await res.json();
    } catch {
      throw new CustomError(
        `Request failed with status ${res.status}`,
         res.status,

      );
    }

    console.log('errorData', errorData);
    
    throw new CustomError(
      errorData.title || 'Request failed',
      res.status,
      errorData.errors,
      errorData.title
    );
  }

  return res.json() as Promise<T>;
}
