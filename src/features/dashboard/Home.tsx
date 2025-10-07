// import { Companies } from '../companies/components/Companies';
// import { Courses } from '../courses/components/Courses';
import { ThisWeeksActivities } from "./ThisWeeksActivities/component/ThisWeeksActivities";
import { useLoaderData } from "react-router-dom";
import './css/Home.css';

export function Home() {
  // Få ut aktiviteter från loadern (via homeLoader)
  // activities används ej direkt här, men laddas för barnkomponenter via loadern
  const { activities } = useLoaderData() as { activities: any[] };
  return (
    <div className="home-wrapper">
      <ThisWeeksActivities />
    </div>
  );
}