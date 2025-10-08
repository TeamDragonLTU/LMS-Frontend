import { ReactElement, useState } from "react";
import "./../../../css/modals.css"
import { useFetchActivityTypes } from "../../shared/hooks/useActivityTypes";
import { ErrorDisplay } from "../../shared/components/ErrorDisplay";
import { useCreateActivity } from "../../shared/hooks/useCreateActivity";

interface CreateActivityModalProps {
  moduleId: string;
  minDate: string;
  maxDate: string;
  existingActivities: { startTime: string; endTime: string }[];
  open: boolean;
  onClose: () => void;
  onActivityCreated: () => void;
  userRole?: string;
}

export function CreateActivityModal({
  moduleId,
  minDate,
  maxDate,
  existingActivities,
  open,
  onClose,
  onActivityCreated,
  userRole = "Student",
}: CreateActivityModalProps): ReactElement | null {
  const { activityTypes } = useFetchActivityTypes(open);
  const { postActivity, loading, errors, clearErrors } = useCreateActivity({
    onSuccess: () => {
      onActivityCreated();
      onClose();
    },
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(minDate);
  const [endTime, setEndTime] = useState("");
  const [activityTypeId, setActivityTypeId] = useState("");
  const [overlapError, setOverlapError] = useState<string | null>(null);

  const handleClose = () => {
    resetForm();
    clearErrors();
    onClose();
  };

  const handleOnChange =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      isTimeField: boolean = false
    ) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
      clearErrors();

      if (isTimeField) {
        setOverlapError(null);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      startTime,
      endTime,
      description,
      moduleId,
      activityTypeId,
    };

    if (overlap) {
      setOverlapError("Aktivitetens tid överlappar med en annan aktivitet.");
      return;
    }

    console.log("Payload:", payload);
    await postActivity(payload);
  };

  if (!open) return null;
  const isTeacher = userRole === "Teacher";

  const isFormValid = () => {
    return (
      activityTypeId.trim() !== "" &&
      name.trim() !== "" &&
      startTime.trim() !== "" &&
      endTime.trim() !== "" &&
      description.trim() !== ""
    );
  };

  const resetForm = () => {
    setActivityTypeId("");
    setName("");
    setStartTime("");
    setEndTime("");
    setDescription("");
    setOverlapError(null);
  };

  const newStart = new Date(startTime);
  const newEnd = new Date(endTime);

  console.log("existingActivities", existingActivities);

  const overlap = existingActivities.some((activity) => {
    const activityStart = new Date(activity.startTime);
    const activityEnd = new Date(activity.endTime);
    return newStart <= activityEnd && newEnd >= activityStart;
  });

  return !isTeacher ? null : (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Lägg till aktivitet</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Välj aktivitetstyp *
            <select
              required
              value={activityTypeId}
              onChange={(e) => setActivityTypeId(e.target.value)}
            >
              <option value="">Välj aktivitetstyp</option>
              {activityTypes.map((activityType) => (
                <option key={activityType.id} value={activityType.id}>
                  {activityType.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Namn på aktivitet *
            <input
              type="text"
              placeholder="T.ex. Examination"
              value={name}
              onChange={handleOnChange(setName)}
              onBlur={(e) => setName(e.target.value.trim())}
              required
            />
          </label>
          <label>
            Starttid *
            <input
              type="datetime-local"
              value={startTime}
              onChange={handleOnChange(setStartTime, true)}
              min={minDate}
              max={maxDate}
              required
            />
          </label>
          <label>
            Sluttid *
            <input
              type="datetime-local"
              value={endTime}
              onChange={handleOnChange(setEndTime, true)}
              min={startTime}
              max={maxDate}
              required
            />
          </label>
          <label>
            Beskrivning *
            <textarea
              placeholder="Beskriv aktiviteten och dess innehåll"
              value={description}
              onChange={handleOnChange(setDescription)}
              onBlur={(e) => setDescription(e.target.value.trim())}
              required
            />
          </label>
          <section>
            {overlapError && <p className="error-message">{overlapError}</p>}
            <ErrorDisplay errors={errors} />
          </section>
          <div className="modal-actions">
            <button type="button" onClick={handleClose}>
              Avbryt
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid() || !!overlapError || !!errors}
            >
              Lägg till
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateActivityModal;
