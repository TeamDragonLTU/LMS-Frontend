import React, { ReactElement, useState } from "react";
import "../../../css/modals.css"
import "../css/CreateCourseModal.css";
import { fetchWithToken } from "../../shared/utilities/fetchWithToken";
import { ErrorDisplay } from "../../shared/components/ErrorDisplay";

interface CreateCourseModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export const CreateCourseModal = ({
  onClose,
  onCreated,
}: CreateCourseModalProps): ReactElement => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const isFormValid =
    name.trim() !== "" && description.trim() !== "" && startDate !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    try {
      await fetchWithToken<void>("https://localhost:7213/api/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          startDate: new Date(startDate).toISOString(),
        }),
      });

      onCreated();
      onClose();
    } catch (error: any) {
      console.log("ERROR", error);
      setLoading(false);

      if (
        error?.message &&
        error.message.includes("Unexpected end of JSON input")
      ) {
        onCreated();
        onClose();
        return;
      }

      setErrors(error?.errors || { general: ["Något gick fel."] });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h1>Skapa Kurs</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Namn:
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={(e) => setName(e.target.value.trim())}
              required
            />
          </label>

          <label>
            Beskrivning:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={(e) => setDescription(e.target.value.trim())}
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
          <ErrorDisplay errors={errors} />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Avbryt
            </button>
            <button type="submit" disabled={loading || !isFormValid}>
              {loading ? "Skapar..." : "Skapa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
