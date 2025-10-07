import "../../../css/lmslist.css";
import { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWithToken } from "../../shared/utilities/fetchWithToken";
import { ICourse } from "../types";
import { CreateCourseModal } from "./CreateCourseModal";
import "../css/CreateCourseModal.css";
import { PlusCircle } from "lucide-react";

export function Courses(): ReactElement {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Hämta "mina" kurser från backend
        const data = await fetchWithToken<any>(
          "https://localhost:7213/api/course/my"
        );
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
        setError("Kunde inte hämta kurser.");
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
      <div className="courses-header">
        <h1 className="lmslist-title">Dina kurser</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="create-course-btn"
        >
          <PlusCircle size={16} color="white" />
          Skapa ny kurs
        </button>
      </div>
      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => window.location.reload()}
        />
      )}
      <ul className="lmslist-list">
        {courses.map((course) => (
          <li key={course.id}>
            <div className="lmslist-info">
              <span className="lmslist-name">{course.name}</span>
              <span className="lmslist-email">{course.description}</span>
            </div>
            <Link className="lmslist-role-badge" to={`/course/${course.id}`}>
              Se kursinfo
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
