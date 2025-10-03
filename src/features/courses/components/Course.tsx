import React, { ReactElement, useState } from "react";
import ModuleStudent from "../ModuleStudent/component/ModuleStudent";
import { useLoaderData, useRevalidator } from "react-router";
import { ICourseLoader } from "../types";
import "../../../css/lmslist.css";
import "../css/Courses.css";
import { Pencil } from "lucide-react";
import { EditCourseModal } from "./EditCourseModal";

export function Course(): ReactElement {
  const { course } = useLoaderData<ICourseLoader>();
  const [showModal, setShowModal] = useState(false);
  const { revalidate } = useRevalidator();

  return (
    <main className="lmslist-container">
      <h2 className="lmslist-title">{course.name}</h2>
      <p className="lmslist-subtitle">{course.description}</p>
      <p className="course-startdate">
        Startdatum: {new Date(course.startDate).toLocaleDateString()}
      </p>

      <button
        onClick={() => {
          setShowModal(true);
        }}
        className="edit-course-button"
      >
        <Pencil size={16} style={{ marginRight: "8px" }} />
        Redigera kurs
      </button>

      <section>
        <ModuleStudent />
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
