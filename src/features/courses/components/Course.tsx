import { ReactElement, useState } from "react";
import ModuleStudent from "../ModuleStudent/component/ModuleStudent";
import { useLoaderData, useRevalidator } from "react-router";
import { ICourseLoader } from "../types";
import "../../../css/lmslist.css";
import "../css/Courses.css";
import { Pencil } from "lucide-react";
import { useAuthContext } from "../../auth/hooks/useAuthContext";
import { EditCourseModal } from "./EditCourseModal";

export function Course(): ReactElement {
  const { course } = useLoaderData<ICourseLoader>();
  const [showModal, setShowModal] = useState(false);
  const { revalidate } = useRevalidator();

  const { role } = useAuthContext();
  return (
    <main className="lmslist-container">
      <div className="teacher-course-header-container">
        <div className="teacher-course-header-text-content">
          <h2 className="lmslist-title">{course.name}</h2>
          <p className="lmslist-subtitle">{course.description}</p>
          <p className="course-startdate">
            Startdatum: {new Date(course.startDate).toLocaleDateString()}
          </p>
        </div>
        {role === "Teacher" && (
          <button
            onClick={() => {
              setShowModal(true);
            }}
            className="edit-course-button"
          >
            <Pencil size={18} style={{ marginRight: "4px" }} />
            Redigera kurs
          </button>
        )}
      </div>

      <section>
        <ModuleStudent courseId={course.id} courseStartDate={course.startDate} role={role}/>
      </section>

      {showModal && (
        <EditCourseModal
          course={course}
          onClose={() => setShowModal(false)}
          onUpdated={() => {
            revalidate();
            setShowModal(false);
          }}
        />
      )}
    </main>
  );
}
