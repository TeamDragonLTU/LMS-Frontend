import { ReactElement } from "react";
import { BookOpenCheck, ChevronRight } from "lucide-react";
import { ModuleProps } from "./type";
import "../css/style.css";

interface ModuleCardProps {
  module: ModuleProps;
}

export function ModuleCard({ module }: ModuleCardProps): ReactElement {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
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
        className="module-arrow-btn"
        onClick={() => onClick?.(module)}
        aria-label={`Open ${module.name}`}
      >
        <ChevronRight />
      </button>
    </div>
  );
}

export default ModuleCard;
