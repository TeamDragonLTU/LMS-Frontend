import React, { ReactElement, useState } from "react";
import { ICourse } from "../types";
import "../css/EditCourseModal.css";
import { fetchWithToken } from "../../shared/utilities/fetchWithToken";

interface EditCourseModalProps {
  course: ICourse;
  onClose: () => void;
  onUpdated: () => void;
}

export const EditCourseModal = ({
  course,
  onClose,
  onUpdated,
}: EditCourseModalProps): ReactElement => {
  const [name, setName] = useState(course.name);
  const [description, setDescription] = useState(course.description);
  const [startDate, setStartDate] = useState(course.startDate.substring(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await fetchWithToken<void>(
        `https://localhost:7213/api/course/${course.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            description,
            startDate: new Date(startDate).toISOString(),
          }),
        }
      );

      onUpdated();
      onClose();
    } catch (err: any) {
      if (
        err?.message &&
        err.message.includes("Unexpected end of JSON input")
      ) {
        onUpdated();
        onClose();
        return;
      }

      setError(err?.message || "Något gick fel.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Redigera Kurs</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Namn:
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Beskrivning:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <label>
            Startdatum:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Sparar..." : "Spara"}
            </button>
            <button type="button" onClick={onClose}>
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
