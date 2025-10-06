import { ReactElement } from "react";
import { BookOpenCheck, ChevronRight } from "lucide-react";
import { ModuleProps } from "./type";
import { useState } from "react";
import ActivityStudent from "../../../courses/AktivityStudent/component/ActivityStudent";
import "../css/style.css";

interface ModuleCardProps {
  module: ModuleProps;
}

export function ModuleCard({ module }: ModuleCardProps): ReactElement {
  const[open, setOpen] = useState(false);

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
    <div className="module-card">
      <div className="module-info">
        <div className="module-icon"><BookOpenCheck /></div>
        <div>
          <p className="module-title">{module.name}</p>
          <p className="module-dates">
            {formatDate(module.startDate)} – {formatDate(module.endDate)}
          </p>
        </div>
      </div>
      <button
        onClick={handleClick}
        className="module-arrow-btn"
        aria-label={`Open ${module.name}`}
      >
        <ChevronRight className={open ? "rotated" : ""}/>
      </button>
    </div>
    {open && (
      <div className="module-dropdown">
        <ActivityStudent moduleId={module.id} />
      </div>
    )}
  </div>
);
}

export default ModuleCard;
