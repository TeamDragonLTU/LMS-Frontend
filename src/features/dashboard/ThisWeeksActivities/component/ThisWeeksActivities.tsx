import { ReactElement } from "react";
import { Calendar, Clock, BookOpen } from "lucide-react";
import "../css/ThisWeeksActivities.css";

export const ThisWeeksActivities = (): ReactElement => {
  /* Hårdkodade värden */
  const activities = [
    {
      type: "Föreläsning",
      tagClass: "lecture",
      title: "Introduktion till React",
      date: "2023-09-04",
      time: "09:00-12:00",
    },
    {
      type: "Övning",
      tagClass: "exercise",
      title: "React komponenter",
      date: "2023-09-05",
      time: "09:00-12:00",
    },
    {
      type: "E-learning",
      tagClass: "elearning",
      title: "React Hooks",
      date: "2023-09-06",
      time: "09:00-12:00",
    },
    {
      type: "Inlämning",
      tagClass: "submission",
      title: "React applikation",
      date: "2023-09-08",
      time: "23:59",
    },
  ];

  return (
    <section className="twa-activities-container">
      {/* Header */}
      <div className="twa-header-container">
        <h2 className="twa-header-title">Veckans aktiviteter</h2>
        <div className="twa-week-badge">
          <Calendar size={16} />
          <span>Vecka 36</span>
        </div>
      </div>

      {/* Module */}
      <div className="twa-module-container">
        <div className="twa-module-header">
          <BookOpen size={16} />
          <h4>Modul: Javascript</h4>
        </div>

        {/* Activities */}
        {activities.map((activity, i) => (
          <div key={i} className="twa-activity-container">
            <div className={`twa-tag twa-tag-${activity.tagClass}`}>
              {activity.type}
            </div>
            <div className="twa-activity-content">
              <p className="twa-activity-title">{activity.title}</p>
              <div className="twa-activity-meta">
                <span>
                  <Calendar size={14} /> {activity.date}
                </span>
                <span>
                  <Clock size={14} /> {activity.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
