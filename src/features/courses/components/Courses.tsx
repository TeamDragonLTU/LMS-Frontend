
import '../../../css/lmslist.css';
import { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithToken } from '../../shared/utilities/fetchWithToken';
import { ICourse } from '../types';

export function Courses(): ReactElement {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Hämta "mina" kurser från backend
        const data = await fetchWithToken<any>('https://localhost:7213/api/course/my');
        // Anpassa till rätt format om backend returnerar en kurs eller en lista
        if (Array.isArray(data)) {
          setCourses(data);
        } else if (data && data.courses && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else if (data && data.id) {
          setCourses([data]);
        } else {
          setCourses([]);
        }
      } catch (err) {
        setError('Kunde inte hämta kurser.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <p>Hämtar kurser...</p>;
  if (error) return <p>{error}</p>;
  if (!courses || courses.length === 0) return <p>Inga kurser...</p>;

  return (
    <section className="lmslist-container">
      <h1 className="lmslist-title">Dina kurser</h1>
      <ul className="lmslist-list">
        {courses.map((course) => (
          <li key={course.id}>
            <div className="lmslist-info">
              <span className="lmslist-name">{course.name}</span>
              <span className="lmslist-email">{course.description}</span>
            </div>
            <Link className="lmslist-role-badge" to={`/course/${course.id}`}>Se kursinfo</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
