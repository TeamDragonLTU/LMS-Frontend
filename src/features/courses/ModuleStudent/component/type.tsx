export interface ModuleProps {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status?: "active" | "upcoming" | "past";
}
