import { ReactElement } from "react";
import { Calendar, Clock, BookOpen } from "lucide-react";
import "../css/ThisWeeksActivities.css";
import { useLoaderData } from "react-router-dom";

export const ThisWeeksActivities = (): ReactElement => {
  const { activities } = useLoaderData() as { activities: any[] };
  return (
    <section className="twa-section-container">
      <div className="twa-header-container">
        <h2 className="twa-header-title">
          <BookOpen size={20} /> Veckans aktiviteter
        </h2>
        <div className="twa-week-badge">
          <Calendar size={16} /> Vecka {getWeekNumber(new Date())}
        </div>
      </div>
      {activities.length === 0 ? (
        <div className="twa-empty">Inga aktiviteter denna vecka.</div>
      ) : (
        activities.map((a: any) => (
          <div className="twa-activity-container" key={a.id}>
            <div className="twa-activity-top">
              <span className="twa-tag">{a.type}</span>
              <span className="twa-activity-title">{a.name}</span>
              <span className="twa-module-name">{a.moduleName}</span>
            </div>
            <div className="twa-activity-bottom">
              <span className="twa-datetime">
                <Calendar size={16} /> {new Date(a.startTime).toLocaleDateString()}
              </span>
              <span className="twa-datetime">
                <Clock size={16} /> {new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(a.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

function getWeekNumber(date: Date) {
  // Robust ISO 8601 week number
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}
