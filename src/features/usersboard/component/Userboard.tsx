import { useEffect, useState } from "react";
import React from "react";
import "../../../css/lmslist.css";
import "../../../css/modals.css";
import "./userboard.css";
import { IUserDto } from "../types";
import { fetchWithToken } from "../../shared/utilities/fetchWithToken";
import { useRole } from "../../auth/hooks/useRole";
import { BASE_URL } from "../../shared/constants";
import { PencilLine, Plus, Trash } from "lucide-react";
export default function Userboard() {
  const [classmates, setClassmates] = useState<IUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<IUserDto | null>(null);
  const [deletingUser, setDeletingUser] = useState<IUserDto | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userName: "",
    role: "Student",
    courseId: "",
  });
  const role = useRole();

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

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = (await fetchWithToken(`${BASE_URL}/course/my`)) as {
          id: string;
        };
        setCourseId(data.id);
      } catch (err) {
        console.error("Failed to load course:", err);
      }
    };

    loadCourse();
  }, []);

  // --- ADD USER ---
  const handleAddUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth`, {
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
          CourseId: courseId,
        }),
      });
      if (res.status === 201) {
        setMessage("✅ Användaren registrerades.");
        setShowAddModal(false);
        setNewUser({
          firstName: "",
          lastName: "",
          password: "",
          email: "",
          userName: "",
          role: "Student",
          courseId: "",
        });
        fetchClassmates();
        return;
      }
      const error = await res.json();
      let feedback = "❌ Registrering misslyckades. ";
      if (error) {
        if (Array.isArray(error)) {
          feedback += error
            .map((e) => {
              if (typeof e === "object" && e.description) {
                return `<b>${e.code || ""}</b>: ${e.description}`;
              } else if (typeof e === "object" && e.message) {
                return e.message;
              } else if (typeof e === "string") {
                return e;
              } else {
                return "";
              }
            })
            .filter(Boolean)
            .join("<br/>");
        } else if (typeof error === "object") {
          if (error.errors && typeof error.errors === "object") {
            feedback += "<br/><b>Valideringsfel:</b>";
            for (const key in error.errors) {
              if (Array.isArray(error.errors[key])) {
                feedback += `<br/><b>${key}:</b> ${error.errors[key].join(
                  ", "
                )}`;
              }
            }
          } else if (error.description) {
            feedback += `<br/><b>${error.code || ""}</b>: ${error.description}`;
          } else if (error.message) {
            feedback += `<br/>${error.message}`;
          } else {
            feedback += `<br/>${JSON.stringify(error)}`;
          }
        } else if (typeof error === "string") {
          feedback += `<br/>${error}`;
        }
      }
      setMessage(feedback);
    } catch (e) {
      setMessage("❌ Ett fel inträffade vid registrering.");
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE USER (local only, for demo) ---
  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setLoading(true);
    try {
      setClassmates((prev) =>
        prev.map((u) => (u.id === editingUser.id ? editingUser : u))
      );
      setShowEditModal(false);
      setEditingUser(null);
      setMessage("✅ Användaren uppdaterad (lokalt, ej backend).");
    } catch (e) {
      setError("Kunde inte uppdatera användaren");
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE USER (local only, for demo) ---
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setLoading(true);
    try {
      setClassmates((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setShowDeleteModal(false);
      setDeletingUser(null);
      setMessage("✅ Användaren borttagen (lokalt, ej backend).");
    } catch (e) {
      setError("Kunde inte ta bort användaren");
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
      <h1 className="lmslist-title course-participants">Kursdeltagare</h1>
      <div className="userboard-searchbar-row">
        <section className="userboard-searchbar-search">
          <h2 className="userboard-searchbar-label">Sök deltagare:</h2>
          <input
            id="search-participant"
            name="searchParticipant"
            type="text"
            className="userboard-searchbar-input"
            placeholder="Sök..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </section>
        {role === "Teacher" && (
          <button type="button" onClick={() => setShowAddModal(true)}>
            <Plus size={16} style={{ marginRight: "2px" }} /> Lägg till
            deltagare
          </button>
        )}
      </div>

      {message && (
        <div
          className="userboard-message"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}

      <ul className="lmslist-list">
        {teachers.length > 0 && (
          <>
            <li className="lmslist-section-header">Lärare</li>
            {teachers.map((user, index) => (
              <li key={user.id ? `teacher-${user.id}` : `teacher-${index}`}>
                <div className="lmslist-user-row">
                  <div className="lmslist-info">
                    <span className="lmslist-name">
                      {user.email.split("@")[0]}
                    </span>
                    <span className="lmslist-email">{user.email}</span>
                  </div>
                  <span className="lmslist-role-badge">Lärare</span>
                </div>
                {role === "Teacher" && (
                  <div className="userboard-action-buttons">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => {
                        setEditingUser(user);
                        setShowEditModal(true);
                      }}
                    >
                      <PencilLine size={16} style={{ marginRight: "2px" }} />
                      Redigera
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => {
                        setDeletingUser(user);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash size={16} style={{ marginRight: "2px" }} />
                      Ta bort
                    </button>
                  </div>
                )}
              </li>
            ))}
          </>
        )}

        {students.length > 0 && (
          <>
            <li className="lmslist-section-header">Studenter</li>
            {students.map((user, index) => (
              <li key={user.id ? `student-${user.id}` : `student-${index}`}>
                <div className="lmslist-user-row">
                  <div className="lmslist-info">
                    <span className="lmslist-name">
                      {user.email.split("@")[0]}
                    </span>
                    <span className="lmslist-email">{user.email}</span>
                  </div>
                  <span className="lmslist-role-badge">Student</span>
                </div>
                {role === "Teacher" && (
                  <div className="userboard-action-buttons">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => {
                        setEditingUser(user);
                        setShowEditModal(true);
                      }}
                    >
                      <PencilLine size={16} style={{ marginRight: "2px" }} />
                      Redigera
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => {
                        setDeletingUser(user);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash size={16} style={{ marginRight: "2px" }} />
                      Ta bort
                    </button>
                  </div>
                )}
              </li>
            ))}
          </>
        )}
      </ul>

      {/* --- Add Modal --- */}
      {showAddModal && (
        <div
          className="modal-overlay"
          onClick={backdropClose(() => setShowAddModal(false))}
        >
          <div className="modal-content">
            <h1>Lägg till deltagare</h1>
            <form onSubmit={handleUpdateUser}>
              <label>
                Förnamn:
                <input
                  type="text"
                  placeholder="Förnamn"
                  value={newUser.firstName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                />
              </label>
              <label>
                Efternamn:
                <input
                  type="text"
                  placeholder="Efternamn"
                  value={newUser.lastName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                />
              </label>
              <label>
                E-post:
                <input
                  type="email"
                  placeholder="E-post"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </label>
              <label>
                Lösenord:
                <input
                  type="password"
                  placeholder="Lösenord"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </label>
              <label>
                Roll:
                <select
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
              </label>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Avbryt
                </button>
                <button type="submit" onClick={handleAddUser}>
                  Spara
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Edit Modal --- */}
      {showEditModal && editingUser && (
        <div
          className="modal-overlay"
          onClick={backdropClose(() => setShowEditModal(false))}
        >
          <div className="modal-content">
            <h1>Redigera användare</h1>
            <form onSubmit={handleUpdateUser}>
              <label>
                Användarnamn:
                <input
                  type="text"
                  value={editingUser.userName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, userName: e.target.value })
                  }
                />
              </label>
              <label>
                E-post:
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </label>
              <label>
                Roll:
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Lärare</option>
                </select>
              </label>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Avbryt
                </button>
                <button type="submit">Uppdatera</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Delete Modal --- */}
      {showDeleteModal && deletingUser && (
        <div
          className="modal-overlay"
          onClick={backdropClose(() => setShowDeleteModal(false))}
        >
          <div className="modal-content">
            <h1>Ta bort användare</h1>
            <p className="modal-delete-user-p">
              Är du säker på att du vill ta bort{" "}
              <strong>{deletingUser.userName}</strong>?
            </p>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowDeleteModal(false)}>
                Avbryt
              </button>
              <button type="submit" onClick={handleConfirmDelete}>
                Ja, ta bort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
