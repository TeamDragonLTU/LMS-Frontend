import { Companies } from '../companies/components/Companies';
import { Courses } from '../courses/components/Courses';

import './css/Home.css';
export function Home() {
  return (
    <div className="home-wrapper">
      <Companies />
      <Courses />
    </div>
  );
}