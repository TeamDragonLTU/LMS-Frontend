import { useEffect, useState } from 'react';
import '../../../css/lmslist.css';
import { IUserDto } from '../types';
import { fetchWithToken } from '../../shared/utilities/fetchWithToken';


export default function Userboard() {
  const [classmates, setClassmates] = useState<IUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWithToken<IUserDto[]>('https://localhost:7213/api/course/participants/my')
      .then((data) => {
        console.log('API /api/course/participants/my response:', data);
        setClassmates(data || []);
      })
      .catch((err: any) => setError(err?.message || 'Något gick fel'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Laddar klasskamrater...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const teachers = classmates.filter((u) => u.role === 'Teacher');
  const students = classmates.filter((u) => u.role === 'Student');

  return (
    <div className="lmslist-container">
      <h1 className="lmslist-title">Kursdeltagare</h1>
      <ul className="lmslist-list">
          {teachers.length > 0 && (
            <>
              <li className="lmslist-section-header">Lärare</li>
              {teachers.map((user) => (
                <li key={user.id}>
                  <div className="lmslist-info">
                    <span className="lmslist-name">{user.userName}</span>
                    <span className="lmslist-email">{user.email}</span>
                  </div>
                  <span className="lmslist-role-badge">Lärare</span>
                </li>
              ))}
            </>
          )}
          {students.length > 0 && (
            <>
              <li className="lmslist-section-header">Studenter</li>
              {students.map((user) => (
                <li key={user.id}>
                  <div className="lmslist-info">
                    <span className="lmslist-name">{user.userName}</span>
                    <span className="lmslist-email">{user.email}</span>
                  </div>
                  <span className="lmslist-role-badge">Student</span>
                </li>
              ))}
            </>
          )}
        </ul>
    </div>
  );
}
