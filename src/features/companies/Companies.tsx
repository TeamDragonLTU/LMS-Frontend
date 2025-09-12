/* eslint-disable react-hooks/exhaustive-deps */

import { ReactElement, useEffect } from 'react';
import { ICompany } from '.';
import { BASE_URL } from '../shared';
import { useFetchWithToken } from '../auth';

export function Companies(): ReactElement {
  const {
    data: companies,
    isLoading,
    requestFunc,
  } = useFetchWithToken<ICompany[]>(`${BASE_URL}/companies`);

  useEffect(() => {
    requestFunc();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="companies">
      <h2>List of Companies</h2>
      {companies ? (
        companies.map((c) => (
          <div key={c.id}>
            <p>{c.name}</p>
          </div>
        ))
      ) : (
        <p>No companies...</p>
      )}
    </section>
  );
}
