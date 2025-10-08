export interface ActivityType {
    id: string
    name: string
}

export interface Module {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status?: "active" | "upcoming" | "past";
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  type: string;
}