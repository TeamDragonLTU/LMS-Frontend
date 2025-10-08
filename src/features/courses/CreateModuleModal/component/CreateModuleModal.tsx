import { ReactElement, useState, useEffect } from "react";
import { fetchWithToken } from "../../../shared/utilities";
import { Module } from "../../../shared/interfaces";
import "../../../../css/modals.css"

interface Course {
  id: string;
  name: string;
}

interface CreateModuleModalProps {
  open: boolean;
  onClose: () => void;
  onModuleCreated?: () => void;
  userRole?: string;
  existingModules: { id: string; startDate: string; endDate: string }[];
  editingModule?: Module | null;
  courseStartDate: string
}

export function CreateModuleModal({
  open,
  onClose,
  onModuleCreated,
  userRole = "Student",
  existingModules,
  editingModule,
  courseStartDate
}: CreateModuleModalProps): ReactElement | null {
  const minDate = courseStartDate?.split('T')[0] || '';
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(minDate);
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  console.log('minDate', minDate);
  

  const resetForm = () => {
    setSelectedCourse("");
    setName("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (open) {
      fetchCourses();
    }
  }, [open]);

  useEffect(() => {
    if (editingModule) {
      // setSelectedCourse(editingModule.courseId); // Uncomment if courseId is available
      setName(editingModule.name);
      setStartDate(editingModule.startDate.slice(0, 10));
      setEndDate(editingModule.endDate.slice(0, 10));
      setDescription(editingModule.description);
    } else {
      resetForm();
    }
  }, [editingModule, open]);

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

    const payload = {
      courseId: selectedCourse,
      name,
      startDate,
      endDate,
      description: description.trim() || "Ingen beskrivning",
    };

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    // Overlap check: ignore self if editing!
    const overlap = existingModules.some((mod) => {
      if (editingModule && mod.id === editingModule.id) {
        return false;
      }
      const modStart = new Date(mod.startDate);
      const modEnd = new Date(mod.endDate);
      return newStart <= modEnd && newEnd >= modStart;
    });

    if (overlap) {
      setError("Modulens datum överlappar med en annan modul.");
      setLoading(false);
      return;
    }

    try {
      if (editingModule) {
        await fetchWithToken(`https://localhost:7213/api/module/${editingModule.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetchWithToken("https://localhost:7213/api/module", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (onModuleCreated) onModuleCreated();
      handleClose();
    } catch (err: any) {
      // Ignore errors caused by empty response (204 No Content)
      if (err.message && err.message.includes("Unexpected end of JSON input")) {
        if (onModuleCreated) onModuleCreated();
        handleClose();
      } else {
        setError("Något gick fel vid skapandet av modulen.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  const isTeacher = userRole === "Teacher";

  return !isTeacher ? null : (
    <div className="modal-overlay">
      <div className="modal-content">
        <h1>{editingModule ? "Redigera modul" : "Lägg till modul"}</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Välj kurs *
            <select
              required
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              disabled={!!editingModule}
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
              onBlur={(e) => setName(e.target.value.trim())}
            />
          </label>
          <label>
            Startdatum *
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={minDate}
            />
          </label>
          <label>
            Slutdatum *
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </label>
          <label>
            Beskrivning *
            <textarea
              placeholder="Beskriv modulen och dess innehåll"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              onBlur={(e) => setDescription(e.target.value.trim())}
            />
          </label>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={handleClose}>
              Avbryt
            </button>
            <button type="submit" disabled={loading}>
              {editingModule ? "Spara ändringar" : "Lägg till"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateModuleModal;