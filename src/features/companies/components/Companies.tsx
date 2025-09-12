import { ReactElement, ReactNode, Suspense } from 'react';
import { Await, Link, useLoaderData } from 'react-router';
import { ICompaniesLoader, ICompany } from '../types';

export function Companies(): ReactElement {
  const { companies } = useLoaderData<ICompaniesLoader>();

  const renderCompanies = (companies: ICompany[]): ReactNode => {
    if (companies.length === 0) return <p>No Companies...</p>;

    return companies.map((c) => (
      <div key={c.id}>
        <p>{c.name}</p>
        <Link to={`/companies/${c.id}`}>See more</Link>
      </div>
    ));
  };

  return (
    <main id="companies" className="g-container">
      <h2>List of Companies</h2>
      <Suspense fallback={<p>Loading...</p>}>
        <Await children={(companies) => renderCompanies(companies)} resolve={companies} />
      </Suspense>
    </main>
  );
}
