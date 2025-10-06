import { useEffect, useState } from 'react';
import React from 'react';
import '../../../css/lmslist.css';
import '../css/userboard-adduser.css';
import { IUserDto } from '../types';
import { fetchWithToken } from '../../shared/utilities/fetchWithToken';
import { useRole } from '../../auth/hooks/useRole';
import { BASE_URL } from '../../shared/constants';

export default function Userboard() {
  const [classmates, setClassmates] = useState<IUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const role = useRole();

  useEffect(() => {
    fetchWithToken<IUserDto[]>('https://localhost:7213/api/course/participants/my')
      .then((data) => {
        setClassmates(data || []);
      })
      .catch((err: any) => setError(err?.message || 'Något gick fel'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddUser = async (newUser: { Email: string; UserName: string; Password: string; Role: string }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (res.status === 201) {
        setMessage('✅ Användaren registrerades.');
        setIsAddModalOpen(false);
        setLoading(true);
        fetchWithToken<IUserDto[]>('https://localhost:7213/api/course/participants/my')
          .then((data) => setClassmates(data || []))
          .finally(() => setLoading(false));
        return;
      }
      const error = await res.json();
      console.error('Fel från backend:', error);
      let feedback = '❌ Registrering misslyckades. ';
      if (error) {
        if (Array.isArray(error)) {
          feedback += error
            .map((e) => {
              if (typeof e === 'object' && e.description) {
                return `<b>${e.code || ''}</b>: ${e.description}`;
              } else if (typeof e === 'object' && e.message) {
                return e.message;
              } else if (typeof e === 'string') {
                return e;
              } else {
                return '';
              }
            })
            .filter(Boolean)
            .join('<br/>');
        } else if (typeof error === 'object') {
          if (error.errors && typeof error.errors === 'object') {
            feedback += '<br/><b>Valideringsfel:</b>';
            for (const key in error.errors) {
              if (Array.isArray(error.errors[key])) {
                feedback += `<br/><b>${key}:</b> ${error.errors[key].join(', ')}`;
              }
            }
          } else if (error.description) {
            feedback += `<br/><b>${error.code || ''}</b>: ${error.description}`;
          } else if (error.message) {
            feedback += `<br/>${error.message}`;
          } else {
            feedback += `<br/>${JSON.stringify(error)}`;
          }
        } else if (typeof error === 'string') {
          feedback += `<br/>${error}`;
        }
      }
      setMessage(feedback);
    } catch (e) {
      console.error('Nätverks- eller kodfel vid registrering:', e);
      setMessage('❌ Ett fel inträffade vid registrering.');
    }
  };

  if (loading) return <p>Laddar klasskamrater...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const teachers = classmates.filter((u) => u.role === 'Teacher');
  const students = classmates.filter((u) => u.role === 'Student');

  return (
    <div className="lmslist-container">
      <h1 className="lmslist-title">Kursdeltagare</h1>
      {role === 'Teacher' && (
        <>
          {message && <div className="userboard-message" dangerouslySetInnerHTML={{ __html: message }} />}
          <div className="userboard-toolbar">
            <button className="userboard-btn-primary" onClick={() => setIsAddModalOpen(true)}>
              Lägg till användare
            </button>
          </div>
          {isAddModalOpen && (
            <div className="userboard-modal">
              <div className="userboard-modal-content">
                <h2>Lägg till användare</h2>
                <UserForm
                  onSave={async (newUser) => {
                    await handleAddUser(newUser);
                  }}
                  onCancel={() => setIsAddModalOpen(false)}
                />
              </div>
            </div>
          )}
        </>
      )}
      <ul className="lmslist-list">
        {/* Lärare */}
        {teachers.length > 0 && [
          <li className="lmslist-section-header" key="section-header-teachers">Lärare</li>,
          ...teachers.map((user, idx) => (
            <li key={user.id ? `teacher-${user.id}` : `teacher-${idx}`}>
              <div className="lmslist-info">
                <span className="lmslist-name">{user.userName}</span>
                <span className="lmslist-email">{user.email}</span>
              </div>
              <span className="lmslist-role-badge">Lärare</span>
            </li>
          ))
        ]}
        {/* Studenter */}
        {students.length > 0 && [
          <li className="lmslist-section-header" key="section-header-students">Studenter</li>,
          ...students.map((user, idx) => (
            <li key={user.id ? `student-${user.id}` : `student-${idx}`}>
              <div className="lmslist-info">
                <span className="lmslist-name">{user.userName}</span>
                <span className="lmslist-email">{user.email}</span>
              </div>
              <span className="lmslist-role-badge">Student</span>
            </li>
          ))
        ]}
      </ul>
    </div>
  );
}

const UserForm: React.FC<{
  onSave: (u: { Email: string; UserName: string; Password: string; Role: string }) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    Email: '',
    UserName: '',
    Password: '',
    Role: 'Student',
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="form"
    >
      <input
        className="userboard-input"
        placeholder="Email"
        value={form.Email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, Email: e.target.value })
        }
      />
      <input
        className="userboard-input"
        placeholder="Användarnamn"
        value={form.UserName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, UserName: e.target.value })
        }
      />
      <input
        className="userboard-input"
        type="password"
        placeholder="Lösenord"
        value={form.Password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, Password: e.target.value })
        }
      />
      <select
        className="userboard-input"
        value={form.Role}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setForm({ ...form, Role: e.target.value })
        }
      >
        <option value="Student">Elev</option>
        <option value="Teacher">Lärare</option>
      </select>
      <div className="userboard-modal-actions">
        <button type="submit" className="userboard-btn-primary">
          Spara
        </button>
        <button type="button" className="userboard-btn-secondary" onClick={onCancel}>
          Avbryt
        </button>
      </div>
    </form>
  );
}