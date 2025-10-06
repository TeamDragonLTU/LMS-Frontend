import { useEffect, useState } from "react";
import "../../../css/lmslist.css";
import { IUserDto } from "../types";
import { fetchWithToken } from "../../shared/utilities/fetchWithToken";
import { BASE_URL } from "../../shared/constants";

export default function Userboard() {
  const [classmates, setClassmates] = useState<IUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingUser, setEditingUser] = useState<IUserDto | null>(null);
  const [deletingUser, setDeletingUser] = useState<IUserDto | null>(null);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userName: "", // will be auto-combined, kept for safety
    role: "Student",
  });

  useEffect(() => {
    fetchClassmates();
  }, []);

  const fetchClassmates = () => {
    setLoading(true);
    fetchWithToken<IUserDto[]>(`${BASE_URL}/course/participants/my`)
      .then((data) => setClassmates(data || []))
      .catch((err: unknown) => {
        if (err instanceof Error) setError(err.message);
        else setError("Något gick fel");
      })
      .finally(() => setLoading(false));
  };

  // --- ADD USER ---
  const handleAddUser = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://localhost:7213/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: newUser.email,
          Password: newUser.password,
          UserName: `${newUser.firstName}.${newUser.lastName}`.replace(
            /\s+/g,
            ""
          ),
          Role: newUser.role,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed:", res.status, text);
        setError(`Kunde inte lägga till användaren (${res.status})`);
        return;
      }

      // optional: if backend doesn't return JSON, just skip parsing
      try {
        const text = await res.text();
        if (text) JSON.parse(text);
      } catch {
        console.warn("Response not JSON, continuing...");
      }

      // Reset state and refresh classmates
      setShowAddModal(false);
      setNewUser({
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        userName: "",
        role: "Student",
      });

      fetchClassmates();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Något gick fel");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setLoading(true);
    try {
      setClassmates((prev) =>
        prev.map((u) => (u.id === editingUser.id ? editingUser : u))
      );
      setShowEditModal(false);
      setEditingUser(null);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError("Kunde inte uppdatera användaren");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setLoading(true);
    try {
      setClassmates((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setShowDeleteModal(false);
      setDeletingUser(null);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError("Kunde inte ta bort användaren");
    } finally {
      setLoading(false);
    }
  };

  const filteredClassmates = classmates.filter(
    (u) =>
      u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Laddar klasskamrater...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const teachers = filteredClassmates.filter((u) => u.role === "Teacher");
  const students = filteredClassmates.filter((u) => u.role === "Student");

  const backdropClose =
    (closer: () => void) => (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) closer();
    };

  return (
    <div className="lmslist-container">
      <h1 className="lmslist-title">Kursdeltagare</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Sök användare..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button type="button" onClick={() => setShowAddModal(true)}>
          + Lägg till användare
        </button>
      </div>

      <ul className="lmslist-list">
        {teachers.length > 0 && (
          <>
            <li className="lmslist-section-header">Lärare</li>
            {teachers.map((user, index) => (
              <li key={user.id ? `teacher-${user.id}` : `teacher-${index}`}>
                <div className="lmslist-info">
                  <span className="lmslist-name">{user.userName}</span>
                  <span className="lmslist-email">{user.email}</span>
                </div>
                <span className="lmslist-role-badge">Lärare</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(user);
                    setShowEditModal(true);
                  }}
                >
                  Redigera
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeletingUser(user);
                    setShowDeleteModal(true);
                  }}
                >
                  Ta bort
                </button>
              </li>
            ))}
          </>
        )}

        {students.length > 0 && (
          <>
            <li className="lmslist-section-header">Studenter</li>
            {students.map((user, index) => (
              <li key={user.id ? `student-${user.id}` : `student-${index}`}>
                <div className="lmslist-info">
                  <span className="lmslist-name">{user.userName}</span>
                  <span className="lmslist-email">{user.email}</span>
                </div>
                <span className="lmslist-role-badge">Student</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(user);
                    setShowEditModal(true);
                  }}
                >
                  Redigera
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeletingUser(user);
                    setShowDeleteModal(true);
                  }}
                >
                  Ta bort
                </button>
              </li>
            ))}
          </>
        )}
      </ul>

      {/* --- Add Modal --- */}
      {showAddModal && (
        <div
          className="modal"
          onClick={backdropClose(() => setShowAddModal(false))}
        >
          <div className="modal-content">
            <h2>Lägg till användare</h2>

            <label className="modal-label">Förnamn</label>
            <input
              className="modal-input"
              type="text"
              placeholder="Förnamn"
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
            />

            <label className="modal-label">Efternamn</label>
            <input
              className="modal-input"
              type="text"
              placeholder="Efternamn"
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
            />

            <label className="modal-label">E-post</label>
            <input
              className="modal-input"
              type="email"
              placeholder="E-post"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <label className="modal-label">Lösenord</label>
            <input
              className="modal-input"
              type="password"
              placeholder="Lösenord"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />

            <label className="modal-label">Roll</label>
            <select
              className="modal-input"
              value={newUser.role}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  role: e.target.value as "Student" | "Teacher",
                })
              }
            >
              <option value="Student">Student</option>
              <option value="Teacher">Lärare</option>
            </select>

            <div className="modal-actions">
              <button type="button" onClick={handleAddUser}>
                Spara
              </button>
              <button type="button" onClick={() => setShowAddModal(false)}>
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Modal --- */}
      {showEditModal && editingUser && (
        <div
          className="modal"
          onClick={backdropClose(() => setShowEditModal(false))}
        >
          <div className="modal-content">
            <h2>Redigera användare</h2>

            <label className="modal-label">Användarnamn</label>
            <input
              className="modal-input"
              type="text"
              value={editingUser.userName}
              onChange={(e) =>
                setEditingUser({ ...editingUser, userName: e.target.value })
              }
            />

            <label className="modal-label">E-post</label>
            <input
              className="modal-input"
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />

            <label className="modal-label">Roll</label>
            <select
              className="modal-input"
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
            >
              <option value="Student">Student</option>
              <option value="Teacher">Lärare</option>
            </select>

            <div className="modal-actions">
              <button type="button" onClick={handleUpdateUser}>
                Uppdatera
              </button>
              <button type="button" onClick={() => setShowEditModal(false)}>
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Modal --- */}
      {showDeleteModal && deletingUser && (
        <div
          className="modal"
          onClick={backdropClose(() => setShowDeleteModal(false))}
        >
          <div className="modal-content">
            <h2>Ta bort användare</h2>
            <p>
              Är du säker på att du vill ta bort{" "}
              <strong>{deletingUser.userName}</strong>?
            </p>
            <div className="modal-actions">
              <button type="button" onClick={handleConfirmDelete}>
                Ja, ta bort
              </button>
              <button type="button" onClick={() => setShowDeleteModal(false)}>
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
