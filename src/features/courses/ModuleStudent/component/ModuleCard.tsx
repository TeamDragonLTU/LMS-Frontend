import { ReactElement } from "react";
import { BookOpenCheck, ChevronRight, PencilLine, Trash } from "lucide-react";
import { useState } from "react";
import ActivityStudent from "../../../courses/AktivityStudent/component/ActivityStudent";
import "../css/style.css";
import { fetchWithToken } from "../../../shared/utilities";
import { Module } from "../../../shared/interfaces";

interface ModuleCardProps {
  module: Module;
  onModuleDeleted?: () => void;
  onEdit: (module: Module) => void;
}

export function ModuleCard({
  module,
  onModuleDeleted,
  onEdit,
  role,
}: ModuleCardProps & { role?: string | null }): ReactElement {
  const [open, setOpen] = useState(false);
  const moduleTimeframeDates = {
    startDate: module.startDate,
    endDate: module.endDate,
  };

  const handleDelete = async () => {
    if (window.confirm("Vill du verkligen ta bort denna modul?")) {
      try {
        await fetchWithToken(`https://localhost:7213/api/module/${module.id}`, {
          method: "DELETE",
        }).catch((err) => {
          if (
            err instanceof SyntaxError &&
            err.message.includes("Unexpected end of JSON input")
          ) {
            return;
          }
          throw err;
        });
        if (onModuleDeleted) onModuleDeleted();
      } catch {
        alert("Kunde inte ta bort modulen.");
      }
    }
  };

  const handleClick = () => {
    setOpen(!open);
  };
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="module-card-container">
      <div className="module-card" onClick={handleClick} style={{ cursor: "pointer" }}>
        <div className="module-info">
          <div className="module-icon">
            <BookOpenCheck />
          </div>
          <div>
            <p className="module-title">{module.name}</p>
            <p className="module-dates">
              {formatDate(module.startDate)} – {formatDate(module.endDate)}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
          className="module-arrow-btn"
          aria-label={`Open ${module.name}`}
        >
          <ChevronRight className={open ? "rotated" : ""} />
        </button>
      </div>
      {open && (
        <div className="module-actions">
          <p className="list-subtitle">{module.description}</p>
          {role === "Teacher" && (
            <>
              <button className="edit-btn" onClick={() => onEdit(module)}>
                <PencilLine /> Redigera
              </button>
              <button onClick={handleDelete} className="delete-btn">
                <Trash />
                Ta bort
              </button>
            </>
          )}
        </div>
      )}
      {open && (
        <div className="module-dropdown">
          <ActivityStudent
            moduleId={module.id}
            moduleTimeframeDates={moduleTimeframeDates}
            role={role}
          />
        </div>
      )}
    </div>
  );
}

export default ModuleCard;
