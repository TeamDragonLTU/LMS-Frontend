import '../css/Companies.css';
import { ReactElement } from 'react';
import { Link, useLoaderData } from 'react-router';
import { ICompany } from '../types';

export function Companies(): ReactElement {
  const { companies } = useLoaderData() as { companies: ICompany[] };
  if (!companies || companies.length === 0) return <p>No Companies...</p>;
  return (
    <main id="companies" className="g-container">
      <h2>List of Companies</h2>
      {companies.map((c) => (
        <div key={c.id}>
          <p>{c.name}</p>
          <Link to={`/companies/${c.id}`}>See more</Link>
        </div>
      ))}
    </main>
  );
}
