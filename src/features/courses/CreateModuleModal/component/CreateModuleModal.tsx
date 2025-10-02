import { ReactElement, useState, useEffect } from "react";
import "../css/style.css";
import { fetchWithToken } from "../../../shared/utilities";

interface Course {
  id: string;
  name: string;
}

interface CreateModuleModalProps {
  open: boolean;
  onClose: () => void;
  onModuleCreated?: () => void;
}

export function CreateModuleModal({
  open,
  onClose,
  onModuleCreated,
}: CreateModuleModalProps): ReactElement | null {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchCourses();
    }
  }, [open]);

  const fetchCourses = async () => {
    try {
      const data = await fetchWithToken<Course[]>("https://localhost:7213/api/course");
      setCourses(data);
    } catch {
      setCourses([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetchWithToken("https://localhost:7213/api/module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          name,
          startDate,
          endDate,
          description,
        }),
      });
      if (onModuleCreated) onModuleCreated();
      onClose();
    } catch {
      setError("Kunde inte skapa modul.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Lägg till modul</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Välj kurs *
            <select
              required
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Välj kurs</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Modulnamn *
            <input
              type="text"
              required
              placeholder="T.ex. HTML & CSS"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Startdatum *
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            Slutdatum *
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <label>
            Beskrivning
            <textarea
              placeholder="Beskriv modulen och dess innehåll"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          {error && <p className="error">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Avbryt
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              Lägg till
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default CreateModuleModal;