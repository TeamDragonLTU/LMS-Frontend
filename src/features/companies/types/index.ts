/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ICompany {
  id: string;
  name: string;
  address: string;
  employees: any[];
}

export interface ICompaniesLoader {
  companies: Promise<ICompany[]>;
}
export interface ICompanyLoader {
  company: Promise<ICompany>;
}
