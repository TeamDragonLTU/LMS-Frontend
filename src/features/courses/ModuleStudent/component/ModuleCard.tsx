import { ReactElement } from "react";
import { BookOpenCheck, ChevronRight, PencilLine, Trash } from "lucide-react";
import { ModuleProps } from "./type";
import { useState } from "react";
import ActivityStudent from "../../../courses/AktivityStudent/component/ActivityStudent";
import "../css/style.css";
import { fetchWithToken } from "../../../shared/utilities";

interface ModuleCardProps {
  module: ModuleProps;
  onModuleDeleted?: () => void;
}

export function ModuleCard({ module, onModuleDeleted }: ModuleCardProps): ReactElement {
  const[open, setOpen] = useState(false);

const handleDelete = async () => {
  if (window.confirm("Vill du verkligen ta bort denna modul?")) {
    try {
      await fetchWithToken(`https://localhost:7213/api/module/${module.id}`, {
        method: "DELETE",
      }).catch(() => {}); 
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
    {open && (<div className="module-actions"><p className="list-subtitle">{module.description}</p><button className="edit-btn"><PencilLine /> Redigera</button> <button onClick={handleDelete} className="delete-btn"><Trash />Ta bort</button></div>)}
    {open && (
      <div className="module-dropdown">
        <ActivityStudent moduleId={module.id} />
      </div>
    )}
  </div>
);
}


export default ModuleCard;
