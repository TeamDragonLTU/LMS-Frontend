
import { ReactElement, useEffect, useState } from "react";
import ModuleCard from "./ModuleCard";
import { ModuleProps } from "./type";
import "../css/style.css";
import { fetchWithToken } from "../../../shared/utilities";

export function ModuleStudent(): ReactElement {
  const [modules, setModules] = useState<ModuleProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await fetchWithToken<ModuleProps[]>(
          "https://localhost:7213/api/module"
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
      } catch {
        setError("Cannot find module.");
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  // dynamically render sections
  const sections: { title: string; status: ModuleProps["status"] }[] = [
    { title: "Aktiv modul", status: "active" },
    { title: "Kommande moduler", status: "upcoming" },
    { title: "Tidigare moduler", status: "past" },
  ];

  return (
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
  );
}

export default ModuleStudent;
