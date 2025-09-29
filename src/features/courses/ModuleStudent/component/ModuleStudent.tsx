import React, { useEffect, useState } from "react";
import "../css/style.css";

type Module = {
  id: string; // GUID from backend
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status?: "active" | "upcoming" | "past"; // optional, we compute it
};

const ModuleStudent: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch("https://localhost:7213/api/module");
        if (!res.ok) throw new Error("Module cannot be found");
        const data: Module[] = await res.json();

        // compute status
        const today = new Date();
        const withStatus = data.map((m) => {
          const start = new Date(m.startDate);
          const end = new Date(m.endDate);

          let status: "active" | "upcoming" | "past";
          if (today >= start && today <= end) {
            status = "active";
          } else if (today < start) {
            status = "upcoming";
          } else {
            status = "past";
          }

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

  const activeModules = modules.filter((m) => m.status === "active");
  const upcomingModules = modules.filter((m) => m.status === "upcoming");
  const pastModules = modules.filter((m) => m.status === "past");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderModule = (m: Module) => (
    <div key={m.id} className="module-card">
      <div className="module-info">
        <div className="module-icon">📘</div>
        <div>
          <p className="module-title">{m.name}</p>
          <p className="module-dates">
            {formatDate(m.startDate)} – {formatDate(m.endDate)}
          </p>
        </div>
      </div>
      <div className="module-arrow">➜</div>
    </div>
  );

  return (
    <div className="module-container">
      <h2 className="course-title">Frontend-program</h2>
      <p className="course-desc">
        En omfattande utbildning i modern webbutveckling med fokus på JavaScript och React.
      </p>

      {activeModules.length > 0 && (
        <section>
          <h3 className="section-title">Aktiv modul</h3>
          {activeModules.map(renderModule)}
        </section>
      )}

      {upcomingModules.length > 0 && (
        <section>
          <h3 className="section-title">Kommande moduler</h3>
          {upcomingModules.map(renderModule)}
        </section>
      )}

      {pastModules.length > 0 && (
        <section>
          <h3 className="section-title">Tidigare moduler</h3>
          {pastModules.map(renderModule)}
        </section>
      )}
    </div>
  );
};

export default ModuleStudent;
