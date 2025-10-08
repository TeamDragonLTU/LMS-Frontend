import { ReactElement, useEffect, useState, useCallback } from "react";
import ModuleCard from "./ModuleCard";
import CreateModuleModal from "../../CreateModuleModal/component/CreateModuleModal";
import "../css/style.css";
import { fetchWithToken } from "../../../shared/utilities";
import { FilePlus2 } from "lucide-react";
import { Module } from "../../../shared/interfaces";

interface ModuleStudentProps {
  courseId: string;
  courseStartDate: string;
  role?: string | null;
}

export function ModuleStudent({
  courseId,
  courseStartDate,
  role
}: ModuleStudentProps): ReactElement {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setModalOpen(true);
  };

  const fetchModules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWithToken<Module[]>(
        `https://localhost:7213/api/module/${courseId}/modules`
      );

      const today = new Date();
      const withStatus = data.map((m: Module) => {
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

  const sections: { title: string; status: Module["status"] }[] = [
    { title: "Aktiv modul", status: "active" },
    { title: "Kommande moduler", status: "upcoming" },
    { title: "Tidigare moduler", status: "past" },
  ];

  return (
    <div>
      {role === "Teacher" && (
        <div className="module-btn">
          <button
            className="create-module-btn"
            onClick={() => {
              setEditingModule(null);
              setModalOpen(true);
            }}
          >
            <FilePlus2 size={16} style={{ marginRight: "2px" }} /> Lägg till
            modul
          </button>
          <CreateModuleModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onModuleCreated={() => {
              setModalOpen(false);
              fetchModules();
            }}
            userRole={role}
            existingModules={modules}
            editingModule={editingModule}
            courseStartDate={courseStartDate}
          />
        </div>
      )}
      <div className="module-container">
        {sections.map(({ title, status }) => {
          const filteredModules = modules.filter((m) => m.status === status);
          if (!filteredModules.length) return null;
          return (
            <section key={status} className="module-section">
              <h2 className="section-title">{title}</h2>
              {filteredModules.map((m) => (
                <ModuleCard
                  key={m.id}
                  module={m}
                  onModuleDeleted={fetchModules}
                  onEdit={handleEdit}
                  role={role}
                />
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default ModuleStudent;
