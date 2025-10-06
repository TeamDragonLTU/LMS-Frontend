import { ReactElement, useEffect, useState, useCallback } from "react";
import ModuleCard from "./ModuleCard";
import CreateModuleModal from "../../CreateModuleModal/component/CreateModuleModal";
import { ModuleProps } from "./type";
import "../css/style.css";
import { fetchWithToken } from "../../../shared/utilities";
import { FilePlus2 } from "lucide-react";

interface ModuleStudentProps {
  courseId: string;
}

export function ModuleStudent({ courseId }: ModuleStudentProps): ReactElement {
  const [modules, setModules] = useState<ModuleProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const userRole = "Teacher"; 


  const fetchModules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWithToken<ModuleProps[]>(
        `https://localhost:7213/api/module/${courseId}/modules`
      );

      const today = new Date();
      const withStatus = data.map((m: ModuleProps) => {
        const start = new Date(m.startDate);
        const end = new Date(m.endDate);

        let status: "active" | "upcoming" | "past";
        if (today >= start && today <= end) status = "active";
        else if (today < start) status = "upcoming";
        else status = "past";

        return { ...m, status };
      });

      setModules(withStatus);
      setError(null);
    } catch {
      setError("Cannot find module.");
    } finally {
      setLoading(false);
    }
  }, [courseId]); 


  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const sections: { title: string; status: ModuleProps["status"] }[] = [
    { title: "Aktiv modul", status: "active" },
    { title: "Kommande moduler", status: "upcoming" },
    { title: "Tidigare moduler", status: "past" },
  ];

  return (
    <div>
      {userRole === "Teacher" && (
        <div className="module-btn">
          <button
            className="create-module-btn"
            onClick={() => setModalOpen(true)}
          >
            <FilePlus2 /> Lägg en modul
          </button>
          <CreateModuleModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onModuleCreated={() => {
              setModalOpen(false);
              fetchModules(); 
            }}
            userRole={userRole}
          />
        </div>
      )}
      <div className="module-container">
        {sections.map(({ title, status }) => {
          const filteredModules = modules.filter((m) => m.status === status);
          if (!filteredModules.length) return null;
          return (
            <section key={status}>
              <h3 className="section-title">{title}</h3>
              {filteredModules.map((m) => (
                <ModuleCard key={m.id} module={m} />
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default ModuleStudent;
